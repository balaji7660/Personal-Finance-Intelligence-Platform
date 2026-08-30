from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class BudgetBase(BaseModel):
    name: str
    category: str
    monthlyLimit: Decimal
    spent: Optional[Decimal] = Decimal("0.00")
    startDate: date
    endDate: Optional[date] = None

class BudgetCreate(BudgetBase):
    pass

class BudgetUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    monthlyLimit: Optional[Decimal] = None
    spent: Optional[Decimal] = None
    startDate: Optional[date] = None
    endDate: Optional[date] = None

class BudgetResponse(BudgetBase):
    id: int
    userId: int
    remainingAmount: Optional[Decimal] = None
    percentageUsed: Optional[float] = None

    class Config:
        from_attributes = True
