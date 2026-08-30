from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import report_service
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/reports", tags=["Financial Reports"])

@router.get("/financial", response_model=dict)
def get_financial_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = report_service.generate_financial_report(db, current_user)
    return {
        "success": True,
        "message": "Financial report generated",
        "data": report
    }
