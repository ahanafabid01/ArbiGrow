from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field

VALID_TIERS = Literal[
    "Basic Starter",
    "Pro Builder",
    "Elite Investor",
    "Master Director",
    "Global Ambassador",
]

TIER_PACKAGES: dict[str, list[str]] = {
    "Basic Starter": ["Entry Access", "Foundation Access", "Core Access", "Growth Access", "Premium Starter"],
    "Pro Builder": ["Pro Foundation", "Pro Advanced", "Pro Elite", "Pro Strategic", "Pro Maximum"],
    "Elite Investor": ["Elite Foundation", "Elite Enhanced", "Elite Premium", "Elite Strategic", "Elite Maximum"],
    "Master Director": ["Master Foundation", "Master Enhanced", "Master Premium", "Master Strategic", "Master Maximum"],
    "Global Ambassador": ["Ambassador Foundation", "Ambassador Enhanced", "Ambassador Premium", "Ambassador Strategic", "Ambassador Maximum"],
}


class ROISettingUpdate(BaseModel):
    percentage: Decimal = Field(..., ge=1, le=5)


class ROITierApply(BaseModel):
    tier_name: VALID_TIERS
    percentage: Decimal = Field(..., ge=Decimal("0.01"), le=Decimal("25"))


class ROIPackageApply(BaseModel):
    package_name: str = Field(..., min_length=1, max_length=100)
    percentage: Decimal = Field(..., ge=Decimal("0.01"), le=Decimal("25"))
