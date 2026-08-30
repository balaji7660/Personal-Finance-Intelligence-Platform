from typing import List
from decimal import Decimal
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.investment import Investment
from app.schemas.analytics import Recommendation

def generate_recommendations(user: User, expenses: List[Expense], budgets: List[Budget], investments: List[Investment]) -> List[Recommendation]:
    recs: List[Recommendation] = []
    
    income = user.monthlyIncome or Decimal("75000.00")
    total_exp = sum((e.amount for e in expenses), Decimal("0.00"))
    monthly_savings = max(Decimal("0.00"), income - total_exp)
    
    # Needs vs Wants categorization
    needs_categories = {"housing", "rent", "utilities", "bills", "groceries", "medical", "healthcare", "transport", "transportation", "education", "insurance"}
    needs_total = sum((e.amount for e in expenses if e.category and e.category.lower() in needs_categories), Decimal("0.00"))
    wants_total = max(Decimal("0.00"), total_exp - needs_total)
    
    needs_pct = float(needs_total / income * 100) if income > Decimal("0.00") else 0.0
    wants_pct = float(wants_total / income * 100) if income > Decimal("0.00") else 0.0
    savings_pct = float(monthly_savings / income * 100) if income > Decimal("0.00") else 0.0

    # 1. 50/30/20 Rule Insights
    if wants_pct > 35.0:
        recs.append(Recommendation(
            id="rec-503020-wants",
            title="50/30/20 Discretionary Spending Alert",
            category="spending",
            impact="high",
            insight=f"Discretionary spending (wants) is at {wants_pct:.1f}% of income, exceeding the recommended 30% baseline.",
            recommendation=f"Trimming ₹{float(wants_total - (income * Decimal('0.30'))):.0f}/month from dining and impulse shopping will align your cashflow with the 50/30/20 financial rule.",
            actionUrl="/analytics/spending"
        ))
    elif savings_pct < 20.0:
        recs.append(Recommendation(
            id="rec-503020-savings",
            title="Savings Rate Boost Opportunity",
            category="budget",
            impact="high",
            insight=f"Your current monthly savings rate is {savings_pct:.1f}% (target: 20%+).",
            recommendation=f"Increase automated monthly transfers into your high-yield goal funds by ₹{float((income * Decimal('0.20')) - monthly_savings):.0f}/month.",
            actionUrl="/goals"
        ))
    else:
        recs.append(Recommendation(
            id="rec-503020-healthy",
            title="Optimal 50/30/20 Allocation",
            category="budget",
            impact="info",
            insight=f"Excellent cashflow distribution: Needs ({needs_pct:.0f}%), Wants ({wants_pct:.0f}%), Savings ({savings_pct:.0f}%).",
            recommendation="Maintain your disciplined spending structure to build wealth systematically.",
            actionUrl="/analytics/budget"
        ))

    # 2. Emergency Fund Runway Analysis
    total_inv = sum((i.currentValue or i.investedAmount for i in investments), Decimal("0.00"))
    liquid_inv = sum((i.currentValue or i.investedAmount for i in investments if i.type in ["Mutual Funds", "Gold", "Savings", "Bonds"]), Decimal("0.00"))
    liquid_reserves = monthly_savings + liquid_inv
    
    monthly_runway = float(liquid_reserves / total_exp) if total_exp > Decimal("0.00") else 6.0
    
    if monthly_runway < 3.0:
        recs.append(Recommendation(
            id="rec-emergency-low",
            title="Emergency Fund Runway Warning",
            category="emergency",
            impact="high",
            insight=f"Your liquid financial reserves provide roughly {monthly_runway:.1f} months of emergency living expenses.",
            recommendation="Financial experts advise maintaining at least 3-6 months of essential living expenses in liquid funds. Focus on building an emergency reserve.",
            actionUrl="/goals"
        ))
    else:
        recs.append(Recommendation(
            id="rec-emergency-healthy",
            title="Emergency Fund Cushion",
            category="emergency",
            impact="info",
            insight=f"Your liquid reserves provide {monthly_runway:.1f} months of financial runway.",
            recommendation="Your safety net is intact. You can confidently deploy surplus monthly cash into long-term growth investments.",
            actionUrl="/investments"
        ))

    # 3. Budget Overrun / Ceilings
    overbudget_items = [b for b in budgets if b.spent and b.monthlyLimit and b.spent > b.monthlyLimit]
    if overbudget_items:
        top_over = overbudget_items[0]
        exceeded_amt = top_over.spent - top_over.monthlyLimit
        recs.append(Recommendation(
            id=f"rec-budget-{top_over.id}",
            title=f"{top_over.category} Budget Ceiling Exceeded",
            category="budget",
            impact="high",
            insight=f"Your {top_over.category} budget limit (₹{float(top_over.monthlyLimit):,.0f}) is exceeded by ₹{float(exceeded_amt):,.0f}.",
            recommendation=f"Pause non-essential transactions in {top_over.category} for the remainder of the cycle or adjust your limit.",
            actionUrl="/budgets"
        ))

    # 4. Food & Dining Analysis
    food_total = sum((e.amount for e in expenses if e.category and e.category.lower() in ["food", "dining", "restaurants"]), Decimal("0.00"))
    if food_total > (income * Decimal("0.15")):
        recs.append(Recommendation(
            id="rec-food-opt",
            title="Food & Dining Optimization",
            category="spending",
            impact="medium",
            insight=f"Dining and food outlays account for ₹{float(food_total):,.0f} ({float(food_total/income*100):.1f}% of income).",
            recommendation="Cooking at home 2 additional days per week can save approximately ₹3,200/month.",
            actionUrl="/expenses"
        ))

    # 5. Risk-Adjusted Portfolio Rebalancing
    equity_types = {"Stocks", "Mutual Funds", "Equity"}
    equity_inv = sum((i.currentValue or i.investedAmount for i in investments if i.type in equity_types), Decimal("0.00"))
    
    if total_inv > Decimal("0.00"):
        eq_pct = float(equity_inv / total_inv * 100)
        risk_profile = (user.riskPreference or "Moderate").title()
        
        target_eq = 75.0 if risk_profile == "Aggressive" else (40.0 if risk_profile == "Conservative" else 60.0)
        
        if eq_pct > (target_eq + 15.0):
            recs.append(Recommendation(
                id="rec-portfolio-rebalance",
                title=f"Portfolio Rebalancing ({risk_profile} Risk Profile)",
                category="investment",
                impact="medium",
                insight=f"Equity allocation is {eq_pct:.0f}%, above target ({target_eq:.0f}%) for your {risk_profile} risk profile.",
                recommendation="Consider shifting new contributions into Sovereign Gold Bonds or Fixed Income instruments for defensive downside protection.",
                actionUrl="/investments"
            ))
        elif eq_pct < (target_eq - 15.0):
            recs.append(Recommendation(
                id="rec-portfolio-growth",
                title=f"Equity Exposure Expansion ({risk_profile} Risk Profile)",
                category="investment",
                impact="medium",
                insight=f"Equity allocation is currently {eq_pct:.0f}%, below your target ({target_eq:.0f}%).",
                recommendation="Increase index fund SIP contributions to capture long-term market growth.",
                actionUrl="/investments"
            ))
        else:
            recs.append(Recommendation(
                id="rec-portfolio-balanced",
                title="Balanced Portfolio Distribution",
                category="investment",
                impact="info",
                insight=f"Asset allocation ({eq_pct:.0f}% equity) perfectly matches your {risk_profile} risk profile.",
                recommendation="Continue your current automated dollar-cost averaging strategy.",
                actionUrl="/investments"
            ))

    return recs
