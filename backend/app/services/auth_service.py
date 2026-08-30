from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from app.schemas.user import UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.seed_service import seed_user_data

def register_user(db: Session, request: RegisterRequest) -> AuthResponse:
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is already in use."
        )

    user = User(
        fullName=request.fullName,
        email=request.email,
        mobile=request.mobile,
        password=get_password_hash(request.password),
        currency=request.currency or "INR (₹)",
        monthlyIncome=request.monthlyIncome,
        riskPreference=request.riskPreference or "Moderate",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Seed initial data for the new user
    seed_user_data(db, user.id)

    token = create_access_token(subject=user.id)
    return AuthResponse(token=token, user=UserResponse.model_validate(user))

def login_user(db: Session, request: LoginRequest) -> AuthResponse:
    user = db.query(User).filter(
        (User.email == request.identifier) | (User.mobile == request.identifier)
    ).first()

    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile or password"
        )

    token = create_access_token(subject=user.id)
    return AuthResponse(token=token, user=UserResponse.model_validate(user))
