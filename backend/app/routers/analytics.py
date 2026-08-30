from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from decimal import Decimal
from app.core.database import get_db
from app.services import analytics_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api", tags=["Analytics & Dashboard"])

@router.get("/dashboard", response_model=dict)
def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    metrics = analytics_service.get_dashboard_metrics(db, current_user)
    return {
        "success": True,
        "message": "Dashboard metrics calculated",
        "data": metrics
    }

@router.get("/analytics/spending", response_model=dict)
def get_spending_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    spending_data = analytics_service.get_spending_analytics(db, current_user)
    return {
        "success": True,
        "message": "Spending analytics calculated",
        "data": spending_data
    }

@router.get("/analytics/budget", response_model=dict)
def get_budget_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    budget_data = analytics_service.get_budget_recommendations(db, current_user)
    return {
        "success": True,
        "message": "Budget analytics calculated",
        "data": budget_data
    }

@router.get("/analytics/investments", response_model=dict)
def get_investment_analytics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    investment_data = analytics_service.get_investment_insights(db, current_user)
    return {
        "success": True,
        "message": "Investment analytics calculated",
        "data": investment_data
    }

@router.get("/analytics/financial-health", response_model=dict)
def get_financial_health_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    health = analytics_service.get_financial_health(db, current_user)
    return {
        "success": True,
        "message": "Financial health score calculated",
        "data": health
    }
