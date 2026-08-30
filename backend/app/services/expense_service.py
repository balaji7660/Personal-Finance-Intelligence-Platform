from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from decimal import Decimal
from app.models.expense import Expense
from app.models.budget import Budget
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse

def get_expenses(db: Session, user_id: int) -> List[ExpenseResponse]:
    items = db.query(Expense).filter(Expense.userId == user_id).order_by(Expense.date.desc()).all()
    return [ExpenseResponse.model_validate(item) for item in items]

def get_expense_by_id(db: Session, user_id: int, expense_id: int) -> ExpenseResponse:
    item = db.query(Expense).filter(Expense.id == expense_id, Expense.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found")
    return ExpenseResponse.model_validate(item)

def create_expense(db: Session, user_id: int, dto: ExpenseCreate) -> ExpenseResponse:
    item = Expense(
        userId=user_id,
        amount=dto.amount,
        date=dto.date,
        category=dto.category,
        paymentMethod=dto.paymentMethod,
        description=dto.description,
        notes=dto.notes,
        status=dto.status or "Completed"
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # Auto update budget spent for matching category
    budget = db.query(Budget).filter(Budget.userId == user_id, Budget.category == dto.category).first()
    if budget:
        budget.spent = (budget.spent or Decimal("0.00")) + dto.amount
        db.commit()

    return ExpenseResponse.model_validate(item)

def update_expense(db: Session, user_id: int, expense_id: int, dto: ExpenseUpdate) -> ExpenseResponse:
    item = db.query(Expense).filter(Expense.id == expense_id, Expense.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found")

    if dto.amount is not None: item.amount = dto.amount
    if dto.date is not None: item.date = dto.date
    if dto.category is not None: item.category = dto.category
    if dto.paymentMethod is not None: item.paymentMethod = dto.paymentMethod
    if dto.description is not None: item.description = dto.description
    if dto.notes is not None: item.notes = dto.notes
    if dto.status is not None: item.status = dto.status

    db.commit()
    db.refresh(item)
    return ExpenseResponse.model_validate(item)

def delete_expense(db: Session, user_id: int, expense_id: int):
    item = db.query(Expense).filter(Expense.id == expense_id, Expense.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense record not found")
    db.delete(item)
    db.commit()
