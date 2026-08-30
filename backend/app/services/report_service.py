from sqlalchemy.orm import Session
from decimal import Decimal
from typing import Dict, Any
from datetime import datetime
from app.models.user import User
from app.models.expense import Expense
from app.models.investment import Investment
from app.models.goal import Goal

def generate_financial_report(db: Session, user: User) -> Dict[str, Any]:
    expenses = db.query(Expense).filter(Expense.userId == user.id).all()
    investments = db.query(Investment).filter(Investment.userId == user.id).all()
    goals = db.query(Goal).filter(Goal.userId == user.id).all()

    income = user.monthlyIncome or Decimal("75000.00")
    total_exp = sum((e.amount for e in expenses), Decimal("0.00"))
    total_sav = max(Decimal("0.00"), income - total_exp)
    tot_inv = sum((i.investedAmount for i in investments), Decimal("0.00"))
    curr_inv = sum((i.currentValue or i.investedAmount for i in investments), Decimal("0.00"))
    net_worth = total_sav + curr_inv

    completed_goals = sum(1 for g in goals if g.savedAmount and g.targetAmount and g.savedAmount >= g.targetAmount)

    return {
        "reportType": "Financial Statement Report",
        "generatedAt": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "period": "August 2026",
        "totalIncome": float(income),
        "totalExpenses": float(total_exp),
        "totalSavings": float(total_sav),
        "netWorth": float(net_worth),
        "totalInvested": float(tot_inv),
        "currentPortfolioValue": float(curr_inv),
        "totalReturns": float(curr_inv - tot_inv),
        "portfolioReturnPercentage": round(float((curr_inv - tot_inv) / tot_inv) * 100, 1) if tot_inv > Decimal("0.00") else 0.0,
        "totalGoals": len(goals),
        "completedGoals": completed_goals,
        "activeGoals": len(goals) - completed_goals
    }
