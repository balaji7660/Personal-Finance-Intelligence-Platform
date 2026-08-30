from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse
from app.services import budget_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/budgets", tags=["Budgets Management"])

@router.get("", response_model=dict)
def get_budgets(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = budget_service.get_budgets(db, current_user.id)
    return {
        "success": True,
        "message": "Budgets fetched successfully",
        "data": items
    }

@router.get("/{id}", response_model=dict)
def get_budget_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = budget_service.get_budget_by_id(db, current_user.id, id)
    return {
        "success": True,
        "message": "Budget fetched successfully",
        "data": item
    }

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_budget(dto: BudgetCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = budget_service.create_budget(db, current_user.id, dto)
    return {
        "success": True,
        "message": "Budget created successfully",
        "data": item
    }

@router.put("/{id}", response_model=dict)
def update_budget(id: int, dto: BudgetUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = budget_service.update_budget(db, current_user.id, id, dto)
    return {
        "success": True,
        "message": "Budget updated successfully",
        "data": item
    }

@router.delete("/{id}", response_model=dict)
def delete_budget(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    budget_service.delete_budget(db, current_user.id, id)
    return {
        "success": True,
        "message": "Budget deleted successfully",
        "data": None
    }
