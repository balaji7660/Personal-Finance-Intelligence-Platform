from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserResponse, UserUpdate
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["Users Profile"])

@router.get("/profile", response_model=dict)
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "message": "Profile fetched successfully",
        "data": UserResponse.model_validate(current_user)
    }

@router.put("/profile", response_model=dict)
def update_profile(dto: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if dto.fullName is not None: current_user.fullName = dto.fullName
    if dto.mobile is not None: current_user.mobile = dto.mobile
    if dto.currency is not None: current_user.currency = dto.currency
    if dto.monthlyIncome is not None: current_user.monthlyIncome = dto.monthlyIncome
    if dto.riskPreference is not None: current_user.riskPreference = dto.riskPreference
    if dto.avatar is not None: current_user.avatar = dto.avatar

    db.commit()
    db.refresh(current_user)
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": UserResponse.model_validate(current_user)
    }
