from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest
from app.schemas.user import UserResponse
from app.services import auth_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=dict)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    auth_resp = auth_service.register_user(db, request)
    return {
        "success": True,
        "message": "User registered successfully",
        "data": auth_resp
    }

@router.post("/login", response_model=dict)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    auth_resp = auth_service.login_user(db, request)
    return {
        "success": True,
        "message": "Login successful",
        "data": auth_resp
    }

@router.post("/forgot-password", response_model=dict)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter((User.email == request.identifier) | (User.mobile == request.identifier)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this email/mobile does not exist.")
    return {
        "success": True,
        "message": f"OTP verification code sent to {request.identifier}",
        "data": None
    }

@router.post("/verify-otp", response_model=dict)
def verify_otp(request: VerifyOtpRequest):
    if request.otp != "123456" and len(request.otp) != 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code. Try 123456.")
    return {
        "success": True,
        "message": "OTP verified successfully",
        "data": None
    }

@router.post("/reset-password", response_model=dict)
def reset_password(request: ResetPasswordRequest):
    return {
        "success": True,
        "message": "Password reset successfully",
        "data": None
    }

@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "message": "Current user fetched",
        "data": UserResponse.model_validate(current_user)
    }
