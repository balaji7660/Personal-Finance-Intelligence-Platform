from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class GoalBase(BaseModel):
    name: str
    type: str
    targetAmount: Decimal
    savedAmount: Optional[Decimal] = Decimal("0.00")
    targetDate: date
    priority: Optional[str] = "High"
    notes: Optional[str] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    targetAmount: Optional[Decimal] = None
    savedAmount: Optional[Decimal] = None
    targetDate: Optional[date] = None
    priority: Optional[str] = None
    notes: Optional[str] = None

class GoalResponse(GoalBase):
    id: int
    userId: int
    remainingAmount: Optional[Decimal] = None
    progressPercentage: Optional[float] = None
    monthlyRequiredSavings: Optional[Decimal] = None

    class Config:
        from_attributes = True
