from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class ExpenseBase(BaseModel):
    amount: Decimal
    date: date
    category: str
    paymentMethod: str
    description: str
    notes: Optional[str] = None
    status: Optional[str] = "Completed"

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = None
    date: Optional[date] = None
    category: Optional[str] = None
    paymentMethod: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class ExpenseResponse(ExpenseBase):
    id: int
    userId: int

    class Config:
        from_attributes = True
