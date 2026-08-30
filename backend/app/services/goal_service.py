from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from decimal import Decimal
from datetime import date
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse

def _to_response(g: Goal) -> GoalResponse:
    res = GoalResponse.model_validate(g)
    tgt = res.targetAmount or Decimal("1.00")
    saved = res.savedAmount or Decimal("0.00")
    rem = tgt - saved
    res.remainingAmount = max(Decimal("0.00"), rem)
    if tgt > Decimal("0.00"):
        res.progressPercentage = round(float(saved / tgt) * 100, 1)
    else:
        res.progressPercentage = 0.0
    
    # Calculate monthly required savings
    months = 12
    if g.targetDate:
        days = (g.targetDate - date.today()).days
        months = max(1, days // 30)
    res.monthlyRequiredSavings = round(res.remainingAmount / Decimal(str(months)), 2)
    return res

def get_goals(db: Session, user_id: int) -> List[GoalResponse]:
    items = db.query(Goal).filter(Goal.userId == user_id).all()
    return [_to_response(item) for item in items]

def get_goal_by_id(db: Session, user_id: int, goal_id: int) -> GoalResponse:
    item = db.query(Goal).filter(Goal.id == goal_id, Goal.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return _to_response(item)

def create_goal(db: Session, user_id: int, dto: GoalCreate) -> GoalResponse:
    item = Goal(
        userId=user_id,
        name=dto.name,
        type=dto.type,
        targetAmount=dto.targetAmount,
        savedAmount=dto.savedAmount or Decimal("0.00"),
        targetDate=dto.targetDate,
        priority=dto.priority or "High",
        notes=dto.notes
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_response(item)

def update_goal(db: Session, user_id: int, goal_id: int, dto: GoalUpdate) -> GoalResponse:
    item = db.query(Goal).filter(Goal.id == goal_id, Goal.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    if dto.name is not None: item.name = dto.name
    if dto.type is not None: item.type = dto.type
    if dto.targetAmount is not None: item.targetAmount = dto.targetAmount
    if dto.savedAmount is not None: item.savedAmount = dto.savedAmount
    if dto.targetDate is not None: item.targetDate = dto.targetDate
    if dto.priority is not None: item.priority = dto.priority
    if dto.notes is not None: item.notes = dto.notes

    db.commit()
    db.refresh(item)
    return _to_response(item)

def delete_goal(db: Session, user_id: int, goal_id: int):
    item = db.query(Goal).filter(Goal.id == goal_id, Goal.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    db.delete(item)
    db.commit()
