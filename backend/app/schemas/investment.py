from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import date

class InvestmentBase(BaseModel):
    name: str
    type: str
    investedAmount: Decimal
    currentValue: Optional[Decimal] = None
    purchaseDate: date
    quantity: Optional[Decimal] = Decimal("1.00")
    riskLevel: Optional[str] = "Moderate"
    notes: Optional[str] = None

class InvestmentCreate(InvestmentBase):
    pass

class InvestmentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    investedAmount: Optional[Decimal] = None
    currentValue: Optional[Decimal] = None
    purchaseDate: Optional[date] = None
    quantity: Optional[Decimal] = None
    riskLevel: Optional[str] = None
    notes: Optional[str] = None

class InvestmentResponse(InvestmentBase):
    id: int
    userId: int
    profitLoss: Optional[Decimal] = None
    returnPercentage: Optional[float] = None

    class Config:
        from_attributes = True
