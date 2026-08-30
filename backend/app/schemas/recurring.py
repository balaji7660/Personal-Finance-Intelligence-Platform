from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import date, datetime
from typing import Optional

class RecurringExpenseBase(BaseModel):
    title: str = Field(..., max_length=200)
    amount: Decimal = Field(..., gt=0)
    category: str = Field(..., max_length=100)
    frequency: str = Field(default="Monthly") # Monthly, Quarterly, Yearly
    nextDueDate: date
    isAutoRenew: bool = Field(default=True)
    status: str = Field(default="Active")

class RecurringExpenseCreate(RecurringExpenseBase):
    pass

class RecurringExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    frequency: Optional[str] = None
    nextDueDate: Optional[date] = None
    isAutoRenew: Optional[bool] = None
    status: Optional[str] = None

class RecurringExpenseResponse(RecurringExpenseBase):
    id: int
    userId: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
