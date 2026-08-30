from fastapi import APIRouter, Depends
from app.schemas.tax import TaxCalculationRequest, TaxCalculationResponse
from app.services.tax_calculator import calculate_income_tax
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/tax", tags=["Tax Planning"])

@router.post("/calculate", response_model=TaxCalculationResponse)
def calculate_tax(
    req: TaxCalculationRequest,
    current_user: User = Depends(get_current_user)
):
    return calculate_income_tax(req)
