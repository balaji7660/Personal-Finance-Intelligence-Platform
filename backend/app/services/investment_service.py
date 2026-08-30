from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Dict
from decimal import Decimal
from app.models.investment import Investment
from app.schemas.investment import InvestmentCreate, InvestmentUpdate, InvestmentResponse

def _to_response(i: Investment) -> InvestmentResponse:
    res = InvestmentResponse.model_validate(i)
    inv = res.investedAmount or Decimal("0.00")
    curr = res.currentValue or inv
    diff = curr - inv
    res.profitLoss = diff
    if inv > Decimal("0.00"):
        res.returnPercentage = round(float(diff / inv) * 100, 1)
    else:
        res.returnPercentage = 0.0
    return res

def get_investments(db: Session, user_id: int) -> List[InvestmentResponse]:
    items = db.query(Investment).filter(Investment.userId == user_id).all()
    return [_to_response(item) for item in items]

def get_investment_by_id(db: Session, user_id: int, inv_id: int) -> InvestmentResponse:
    item = db.query(Investment).filter(Investment.id == inv_id, Investment.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")
    return _to_response(item)

def create_investment(db: Session, user_id: int, dto: InvestmentCreate) -> InvestmentResponse:
    item = Investment(
        userId=user_id,
        name=dto.name,
        type=dto.type,
        investedAmount=dto.investedAmount,
        currentValue=dto.currentValue or dto.investedAmount,
        purchaseDate=dto.purchaseDate,
        quantity=dto.quantity or Decimal("1.00"),
        riskLevel=dto.riskLevel or "Moderate",
        notes=dto.notes
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return _to_response(item)

def update_investment(db: Session, user_id: int, inv_id: int, dto: InvestmentUpdate) -> InvestmentResponse:
    item = db.query(Investment).filter(Investment.id == inv_id, Investment.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")

    if dto.name is not None: item.name = dto.name
    if dto.type is not None: item.type = dto.type
    if dto.investedAmount is not None: item.investedAmount = dto.investedAmount
    if dto.currentValue is not None: item.currentValue = dto.currentValue
    if dto.purchaseDate is not None: item.purchaseDate = dto.purchaseDate
    if dto.quantity is not None: item.quantity = dto.quantity
    if dto.riskLevel is not None: item.riskLevel = dto.riskLevel
    if dto.notes is not None: item.notes = dto.notes

    db.commit()
    db.refresh(item)
    return _to_response(item)

def delete_investment(db: Session, user_id: int, inv_id: int):
    item = db.query(Investment).filter(Investment.id == inv_id, Investment.userId == user_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investment not found")
    db.delete(item)
    db.commit()

def get_asset_allocation(db: Session, user_id: int) -> Dict[str, float]:
    items = db.query(Investment).filter(Investment.userId == user_id).all()
    total = sum((i.currentValue or i.investedAmount for i in items), Decimal("0.00"))
    
    alloc: Dict[str, float] = {}
    if total > Decimal("0.00"):
        for i in items:
            t = i.type or "Other"
            val = i.currentValue or i.investedAmount
            pct = float(val / total) * 100
            alloc[t] = round(alloc.get(t, 0.0) + pct, 1)
    return alloc
