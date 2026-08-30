from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from decimal import Decimal

class Recommendation(BaseModel):
    id: Optional[str] = None
    title: str
    category: str = "general" # spending, budget, investment, emergency, general
    impact: str = "medium"   # high, medium, info
    insight: str
    recommendation: str
    actionUrl: Optional[str] = None

class DashboardResponse(BaseModel):
    totalIncome: Decimal
    totalExpenses: Decimal
    totalSavings: Decimal
    currentInvestments: Decimal
    budgetUsed: int
    financialHealthScore: int
    recentTransactions: List[Dict[str, Any]]
    expenseSummary: Dict[str, Decimal]
    investmentSummary: Dict[str, Decimal]
    savingsProgress: float

class HealthScoreResponse(BaseModel):
    score: int
    savingsScore: int
    budgetScore: int
    investmentScore: int
    debtScore: int
    needsPct: float = 0.0
    wantsPct: float = 0.0
    savingsPct: float = 0.0
    emergencyRunwayMonths: float = 0.0
    recommendations: List[Recommendation]
