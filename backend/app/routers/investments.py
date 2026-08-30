from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse
from app.services import investment_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/investments", tags=["Investments Management"])

@router.get("", response_model=dict)
def get_investments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = investment_service.get_investments(db, current_user.id)
    return {
        "success": True,
        "message": "Investments fetched successfully",
        "data": items
    }

@router.get("/allocation", response_model=dict)
def get_asset_allocation(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    alloc = investment_service.get_asset_allocation(db, current_user.id)
    return {
        "success": True,
        "message": "Asset allocation fetched successfully",
        "data": alloc
    }

@router.get("/{id}", response_model=dict)
def get_investment_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = investment_service.get_investment_by_id(db, current_user.id, id)
    return {
        "success": True,
        "message": "Investment fetched successfully",
        "data": item
    }

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_investment(dto: InvestmentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = investment_service.create_investment(db, current_user.id, dto)
    return {
        "success": True,
        "message": "Investment added successfully",
        "data": item
    }

@router.put("/{id}", response_model=dict)
def update_investment(id: int, dto: InvestmentUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = investment_service.update_investment(db, current_user.id, id, dto)
    return {
        "success": True,
        "message": "Investment updated successfully",
        "data": item
    }

@router.delete("/{id}", response_model=dict)
def delete_investment(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    investment_service.delete_investment(db, current_user.id, id)
    return {
        "success": True,
        "message": "Investment deleted successfully",
        "data": None
    }
