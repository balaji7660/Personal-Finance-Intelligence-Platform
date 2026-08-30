from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, Union
from decimal import Decimal
from app.schemas.user import UserResponse

class LoginRequest(BaseModel):
    identifier: str
    password: str

class RegisterRequest(BaseModel):
    fullName: str
    email: EmailStr
    mobile: Optional[str] = None
    password: str
    currency: Optional[str] = "INR (₹)"
    monthlyIncome: Optional[Union[Decimal, str]] = Decimal("75000.00")
    riskPreference: Optional[str] = "Moderate"

    @field_validator('monthlyIncome', mode='before')
    @classmethod
    def validate_income(cls, v):
        if v is None or v == "":
            return Decimal("75000.00")
        try:
            return Decimal(str(v))
        except Exception:
            return Decimal("75000.00")

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

class ForgotPasswordRequest(BaseModel):
    identifier: str

class VerifyOtpRequest(BaseModel):
    otp: str

class ResetPasswordRequest(BaseModel):
    otp: str
    newPassword: str
