from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.recurring_expense import RecurringExpense
from app.schemas.recurring import RecurringExpenseCreate, RecurringExpenseUpdate, RecurringExpenseResponse

router = APIRouter(prefix="/api/recurring-expenses", tags=["Recurring Expenses"])

@router.get("", response_model=List[RecurringExpenseResponse])
def get_recurring_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(RecurringExpense).filter(RecurringExpense.userId == current_user.id).all()

@router.post("", response_model=RecurringExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_recurring_expense(
    payload: RecurringExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = RecurringExpense(
        userId=current_user.id,
        **payload.model_dump()
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/{item_id}", response_model=RecurringExpenseResponse)
def update_recurring_expense(
    item_id: int,
    payload: RecurringExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == item_id,
        RecurringExpense.userId == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Recurring expense not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring_expense(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(RecurringExpense).filter(
        RecurringExpense.id == item_id,
        RecurringExpense.userId == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Recurring expense not found")

    db.delete(item)
    db.commit()
    return None
