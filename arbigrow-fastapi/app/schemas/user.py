# from pydantic import BaseModel, EmailStr
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=6, max_length=60)
    referral_code: str | None = None


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    referral_code: str
    is_admin: bool
    username: str

    main_wallet: Decimal
    deposit_wallet: Decimal
    withdraw_wallet: Decimal
    referral_wallet: Decimal
    generation_wallet: Decimal
    arbx_wallet: Decimal
    arbx_mining_wallet: Decimal
    email_verified: bool

    phone_number: Optional[str] = None
    country: Optional[str] = None
    is_mining: Optional[bool] = False
    mining_started_at: Optional[datetime] = None
    account_status: str = "active"
    account_issue: Optional[str] = None

    class Config:
        from_attributes = True
        json_encoders = {Decimal: lambda v: format(v, ".14f")}


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    user: UserResponse
    doc_submitted: bool
    kyc_status: Optional[str] = None

    class Config:
        from_attributes = True


class UserRefreshResponse(BaseModel):
    user: UserResponse
    doc_submitted: bool
    kyc_status: Optional[str] = None


class IdentityVerificationRequest(BaseModel):
    nid_passport: str = Field(..., min_length=5, max_length=30)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    new_password: str


class ResendVerificationRequest(BaseModel):
    email: EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6, pattern=r"^\d{6}$")


class ReferralMemberResponse(BaseModel):
    id: int
    name: str
    username: str
    level: int
    join_date: str
    total_earnings: Decimal
    referred_by: Optional[str] = None
    direct_referrals: int = 0
    status: str

    class Config:
        from_attributes = True
        json_encoders = {Decimal: lambda v: format(v, ".14f")}


class ReferralLevelResponse(BaseModel):
    level: int
    commission_rate: str
    total_earnings: Decimal
    users: List[ReferralMemberResponse]

    class Config:
        from_attributes = True
        json_encoders = {Decimal: lambda v: format(v, ".14f")}


class ReferralNetworkResponse(BaseModel):
    total_referrals: int
    total_active_referrals: int
    levels: List[ReferralLevelResponse]

    class Config:
        from_attributes = True
        json_encoders = {Decimal: lambda v: format(v, ".14f")}
