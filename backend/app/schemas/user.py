from pydantic import BaseModel, EmailStr
from typing import Optional
from decimal import Decimal
from datetime import datetime

class UserBase(BaseModel):
    fullName: str
    email: str
    mobile: Optional[str] = None
    currency: Optional[str] = "INR (₹)"
    monthlyIncome: Optional[Decimal] = Decimal("75000.00")
    riskPreference: Optional[str] = "Moderate"
    avatar: Optional[str] = None
    occupation: Optional[str] = None
    location: Optional[str] = None

class UserUpdate(BaseModel):
    fullName: Optional[str] = None
    mobile: Optional[str] = None
    currency: Optional[str] = None
    monthlyIncome: Optional[Decimal] = None
    riskPreference: Optional[str] = None
    avatar: Optional[str] = None
    occupation: Optional[str] = None
    location: Optional[str] = None

class UserResponse(UserBase):
    id: int
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True
