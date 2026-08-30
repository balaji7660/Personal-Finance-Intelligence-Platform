from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List, Dict, Optional

class TaxCalculationRequest(BaseModel):
    grossIncome: Decimal = Field(default=Decimal("1200000.00"), description="Annual gross income")
    section80C: Decimal = Field(default=Decimal("150000.00"), description="Section 80C investments (EPF, PPF, ELSS)")
    section80D: Decimal = Field(default=Decimal("25000.00"), description="Section 80D Health Insurance")
    hraExemption: Decimal = Field(default=Decimal("50000.00"), description="House Rent Allowance Exemption")
    standardDeduction: Decimal = Field(default=Decimal("75000.00"), description="Standard Deduction")

class RegimeTaxDetails(BaseModel):
    regimeName: str
    taxableIncome: Decimal
    baseTax: Decimal
    cess: Decimal
    totalTax: Decimal
    effectiveRate: float
    slabs: List[Dict[str, str]]

class TaxCalculationResponse(BaseModel):
    grossIncome: Decimal
    oldRegime: RegimeTaxDetails
    newRegime: RegimeTaxDetails
    recommendedRegime: str
    annualTaxSavings: Decimal
    recommendations: List[str]
