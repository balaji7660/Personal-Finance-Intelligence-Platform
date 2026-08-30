from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.services import expense_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/expenses", tags=["Expenses Management"])

@router.get("", response_model=dict)
def get_expenses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = expense_service.get_expenses(db, current_user.id)
    return {
        "success": True,
        "message": "Expenses fetched successfully",
        "data": items
    }

@router.get("/{id}", response_model=dict)
def get_expense_by_id(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = expense_service.get_expense_by_id(db, current_user.id, id)
    return {
        "success": True,
        "message": "Expense fetched successfully",
        "data": item
    }

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_expense(dto: ExpenseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = expense_service.create_expense(db, current_user.id, dto)
    return {
        "success": True,
        "message": "Expense created successfully",
        "data": item
    }

@router.put("/{id}", response_model=dict)
def update_expense(id: int, dto: ExpenseUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = expense_service.update_expense(db, current_user.id, id, dto)
    return {
        "success": True,
        "message": "Expense updated successfully",
        "data": item
    }

@router.delete("/{id}", response_model=dict)
def delete_expense(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    expense_service.delete_expense(db, current_user.id, id)
    return {
        "success": True,
        "message": "Expense deleted successfully",
        "data": None
    }
