from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from decimal import Decimal
from app.core.database import get_db

from app.models.user import User
from app.models.kyc import KYC
from app.models.investments import Investment
from app.models.referral_profit_history import ReferralProfitHistory
from app.models.investment_profit_history import InvestmentProfitHistory
from app.schemas.user import UserCreate, UserResponse, UserLogin, LoginResponse, IdentityVerificationRequest, ForgotPasswordRequest, ResetPasswordRequest, ResendVerificationRequest, UserRefreshResponse, ReferralNetworkResponse
from app.core.rate_limiter import limiter

from app.api.v1.deps import get_current_user


router = APIRouter(prefix="/user", tags=["User"])

REFERRAL_LEVEL_RATES = {
    1: "10%",
    2: "8%",
    3: "7%",
    4: "6%",
    5: "5%",
}


@router.get("/me", response_model=UserRefreshResponse)
@limiter.limit("400/minute")
async def get_me(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):

    # Fetch latest KYC data
    kyc_result = await db.execute(
        select(KYC).where(KYC.user_id == current_user.id)
    )
    kyc = kyc_result.scalar_one_or_none()

    doc_submitted = bool(kyc and kyc.document_number)
    kyc_status = kyc.status.value if kyc else None

    return {
        "user": UserResponse(
            **current_user.__dict__,
            phone_number=kyc.phone_number if kyc else None,
            country=kyc.country if kyc else None,
        ),
        "doc_submitted": doc_submitted,
        "kyc_status": kyc_status
    }


@router.get("/referral-network", response_model=ReferralNetworkResponse)
@limiter.limit("120/minute")
async def get_referral_network(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    downline_result = await db.execute(
        select(User).where(
            or_(
                User.parent_lvl_1_id == current_user.id,
                User.parent_lvl_2_id == current_user.id,
                User.parent_lvl_3_id == current_user.id,
                User.parent_lvl_4_id == current_user.id,
                User.parent_lvl_5_id == current_user.id,
            )
        )
    )
    downline_users = downline_result.scalars().all()

    level_map = {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    }

    if not downline_users:
        return {
            "total_referrals": 0,
            "total_active_referrals": 0,
            "levels": [
                {
                    "level": level,
                    "commission_rate": REFERRAL_LEVEL_RATES[level],
                    "total_earnings": Decimal("0"),
                    "users": [],
                }
                for level in range(1, 6)
            ],
        }

    parent_ids = {
        user.parent_lvl_1_id for user in downline_users if user.parent_lvl_1_id
    }
    parent_usernames = {}
    if parent_ids:
        parent_result = await db.execute(
            select(User.id, User.username).where(User.id.in_(parent_ids))
        )
        parent_usernames = {pid: username for pid,
                            username in parent_result.all()}

    candidate_ids = [current_user.id] + [u.id for u in downline_users]
    direct_counts_result = await db.execute(
        select(User.parent_lvl_1_id, func.count(User.id))
        .where(User.parent_lvl_1_id.in_(candidate_ids))
        .group_by(User.parent_lvl_1_id)
    )
    direct_counts = {pid: count for pid,
                     count in direct_counts_result.all() if pid}

    downline_ids = [u.id for u in downline_users]

    active_result = await db.execute(
        select(Investment.user_id).where(
            Investment.status == "active",
            Investment.user_id.in_(downline_ids),
        )
    )

    active_user_ids = {row[0] for row in active_result.all()}

    total_active_referrals = 0
    for member in downline_users:
        level = None
        if member.parent_lvl_1_id == current_user.id:
            level = 1
        elif member.parent_lvl_2_id == current_user.id:
            level = 2
        elif member.parent_lvl_3_id == current_user.id:
            level = 3
        elif member.parent_lvl_4_id == current_user.id:
            level = 4
        elif member.parent_lvl_5_id == current_user.id:
            level = 5

        if not level:
            continue

        if member.email_verified:
            total_active_referrals += 1

        member_earnings = (member.referral_wallet or Decimal("0")) + (
            member.generation_wallet or Decimal("0")
        )

        # determine investment status
        status = "active" if member.id in active_user_ids else "inactive"

        level_map[level].append(
            {
                "id": member.id,
                "name": member.full_name,
                "username": member.username,
                "level": level,
                "join_date": member.created_at.strftime("%b %d, %Y"),
                "total_earnings": member_earnings,
                "referred_by": parent_usernames.get(member.parent_lvl_1_id),
                "direct_referrals": direct_counts.get(member.id, 0),
                "status": status,
            }
        )

    levels = []
    for level in range(1, 6):
        users = level_map[level]
        level_total = sum(
            (user_row["total_earnings"] for user_row in users),
            Decimal("0"),
        )
        levels.append(
            {
                "level": level,
                "commission_rate": REFERRAL_LEVEL_RATES[level],
                "total_earnings": level_total,
                "users": users,
            }
        )

    return {
        "total_referrals": len(downline_users),
        "total_active_referrals": total_active_referrals,
        "levels": levels,
    }


@router.post("/start-mining")
@limiter.limit("10/minute")
async def start_mining(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if (current_user.account_status or "").lower() == "on_hold":
        issue_note = (current_user.account_issue or "").strip()
        detail = "Your account is on hold. Mining is currently disabled."
        if issue_note:
            detail = f"{detail} Issue: {issue_note}"
        raise HTTPException(status_code=403, detail=detail)

    if current_user.is_mining:
        raise HTTPException(
            status_code=400,
            detail="Mining already active"
        )

    current_user.is_mining = True
    current_user.mining_started_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(current_user)

    return {
        "message": "Mining started",
        "is_mining": current_user.is_mining,
        "mining_started_at": current_user.mining_started_at,
        "arbx_mining_wallet": current_user.arbx_mining_wallet,
    }


@router.post("/claim-mining")
@limiter.limit("60/minute")
async def claim_mining(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if (current_user.account_status or "").lower() == "on_hold":
        issue_note = (current_user.account_issue or "").strip()
        detail = "Your account is on hold. Mining rewards cannot be claimed."
        if issue_note:
            detail = f"{detail} Issue: {issue_note}"
        raise HTTPException(status_code=403, detail=detail)

    if not current_user.is_mining or not current_user.mining_started_at:
        raise HTTPException(
            status_code=400,
            detail="Mining not started"
        )

    mining_end = current_user.mining_started_at + timedelta(hours=24)

    if datetime.now(timezone.utc) < mining_end:
        raise HTTPException(
            status_code=400,
            detail="Mining cycle not finished yet"
        )

    # reward calculation
    reward_rate = Decimal("0.0001")
    reward = current_user.arbx_wallet * reward_rate

    current_user.arbx_mining_wallet += reward

    # reset mining cycle
    current_user.is_mining = False
    current_user.mining_started_at = None

    await db.commit()
    await db.refresh(current_user)

    return {
        "message": "Mining reward claimed",
        "reward": reward,
        "arbx_mining_wallet": current_user.arbx_mining_wallet,
        "is_mining": current_user.is_mining,
        "mining_started_at": current_user.mining_started_at,
    }


@router.get("/earnings-history")
@limiter.limit("120/minute")
async def get_earnings_history(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all referral and generation profit history for the current user."""
    result = await db.execute(
        select(ReferralProfitHistory)
        .where(ReferralProfitHistory.receiver_user_id == current_user.id)
        .order_by(ReferralProfitHistory.created_at.desc())
        .limit(500)
    )
    items = result.scalars().all()

    # Collect source user IDs to resolve usernames
    source_ids = {item.source_user_id for item in items}
    usernames: dict[int, str] = {}
    if source_ids:
        uname_result = await db.execute(
            select(User.id, User.username).where(User.id.in_(source_ids))
        )
        usernames = {uid: uname for uid, uname in uname_result.all()}

    data = [
        {
            "id": item.id,
            "amount": float(item.amount),
            "level": item.level,
            "percentage": float(item.percentage),
            "type": item.type,
            "wallet_type": "referral" if item.level == 1 else "generation",
            "from_username": usernames.get(item.source_user_id, "-"),
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in items
    ]

    return {"data": data}


@router.get("/profit-history")
@limiter.limit("120/minute")
async def get_profit_history(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all investment daily profit credits for the current user."""
    inv_result = await db.execute(
        select(Investment.id, Investment.package_name)
        .where(Investment.user_id == current_user.id)
    )
    investments = inv_result.all()
    if not investments:
        return {"data": []}

    investment_ids = [row.id for row in investments]
    pkg_names = {row.id: row.package_name for row in investments}

    history_result = await db.execute(
        select(InvestmentProfitHistory)
        .where(InvestmentProfitHistory.investment_id.in_(investment_ids))
        .order_by(InvestmentProfitHistory.created_at.desc())
        .limit(1000)
    )
    items = history_result.scalars().all()

    return {
        "data": [
            {
                "id": item.id,
                "amount": float(item.amount),
                "percentage": float(item.percentage),
                "package_name": pkg_names.get(item.investment_id, ""),
                "created_at": item.created_at.isoformat() if item.created_at else None,
            }
            for item in items
        ]
    }
