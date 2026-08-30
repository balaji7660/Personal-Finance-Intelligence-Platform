from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from decimal import Decimal
from app.models.budget import Budget
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetResponse

def _to_response(b: Budget) -> BudgetResponse:
    res = BudgetResponse.model_validate(b)
    spent = res.spent or Decimal("0.00")
    limit = res.monthlyLimit or Decimal("1.00")
    rem = limit - spent
    res.remainingAmount = max(Decimal("0.00"), rem)
    if limit > Decimal("0.00"):
        res.percentageUsed = round(float(spent / limit) * 100, 1)
    else:
        res.percentageUsed = 0.0
    return res

def get_budgets(db: Session, user_id: int) -> List[BudgetResponse]:
    items = db.query(Budget).filter(Budget.userId == user_id).all()
    return [_to_response(item) for item in items]

def get_budget_by_id(db: Session, user_id: int, budget_id: int) -> BudgetResponse:
    item = db.query(Budget).filter(Budget.id == budget_id, Budget.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    return _to_response(item)

def create_budget(db: Session, user_id: int, dto: BudgetCreate) -> BudgetResponse:
    item = Budget(
        userId=user_id,
        name=dto.name,
        category=dto.category,
        monthlyLimit=dto.monthlyLimit,
        spent=dto.spent or Decimal("0.00"),
        startDate=dto.startDate,
        endDate=dto.endDate
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_response(item)

def update_budget(db: Session, user_id: int, budget_id: int, dto: BudgetUpdate) -> BudgetResponse:
    item = db.query(Budget).filter(Budget.id == budget_id, Budget.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")

    if dto.name is not None: item.name = dto.name
    if dto.category is not None: item.category = dto.category
    if dto.monthlyLimit is not None: item.monthlyLimit = dto.monthlyLimit
    if dto.spent is not None: item.spent = dto.spent
    if dto.startDate is not None: item.startDate = dto.startDate
    if dto.endDate is not None: item.endDate = dto.endDate

    db.commit()
    db.refresh(item)
    return _to_response(item)

def delete_budget(db: Session, user_id: int, budget_id: int):
    item = db.query(Budget).filter(Budget.id == budget_id, Budget.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")
    db.delete(item)
    db.commit()
