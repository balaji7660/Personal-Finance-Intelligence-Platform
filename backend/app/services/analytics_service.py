from sqlalchemy.orm import Session
from decimal import Decimal
from typing import Dict, Any
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.investment import Investment
from app.schemas.analytics import DashboardResponse, HealthScoreResponse
from app.services.recommendation_service import generate_recommendations

def get_dashboard_metrics(db: Session, user: User) -> DashboardResponse:
    expenses = db.query(Expense).filter(Expense.userId == user.id).order_by(Expense.date.desc()).all()
    budgets = db.query(Budget).filter(Budget.userId == user.id).all()
    investments = db.query(Investment).filter(Investment.userId == user.id).all()

    income = user.monthlyIncome or Decimal("75000.00")
    total_exp = sum((e.amount for e in expenses), Decimal("0.00"))
    total_sav = max(Decimal("0.00"), income - total_exp)
    curr_inv = sum((i.currentValue or i.investedAmount for i in investments), Decimal("0.00"))

    total_limit = sum((b.monthlyLimit for b in budgets), Decimal("0.00"))
    total_spent = sum((b.spent or Decimal("0.00") for b in budgets), Decimal("0.00"))
    
    budget_util = 0
    if total_limit > Decimal("0.00"):
        budget_util = int(round(float(total_spent / total_limit) * 100))

    # Calculate Health Score (0-100)
    sav_ratio = float(total_sav / income) if income > Decimal("0.00") else 0.0
    sav_score = min(100, int(sav_ratio * 200))
    bud_score = max(40, 100 - (40 if budget_util > 100 else (20 if budget_util > 80 else 0)))
    inv_score = 82 if curr_inv > Decimal("0.00") else 50
    debt_score = 70
    health_score = int(round(sav_score * 0.35 + bud_score * 0.25 + inv_score * 0.25 + debt_score * 0.15))

    # Recent Transactions
    recent_txs = []
    for e in expenses[:5]:
        recent_txs.append({
            "id": e.id,
            "description": e.description,
            "category": e.category,
            "amount": float(e.amount),
            "date": str(e.date),
            "paymentMethod": e.paymentMethod,
            "status": e.status or "Completed"
        })

    # Expense Summary by Category
    exp_summary: Dict[str, Decimal] = {}
    for e in expenses:
        exp_summary[e.category] = exp_summary.get(e.category, Decimal("0.00")) + e.amount

    # Investment Summary by Type
    inv_summary: Dict[str, Decimal] = {}
    for i in investments:
        val = i.currentValue or i.investedAmount
        inv_summary[i.type] = inv_summary.get(i.type, Decimal("0.00")) + val

    sav_progress = round(sav_ratio * 100, 1)

    return DashboardResponse(
        totalIncome=income,
        totalExpenses=total_exp,
        totalSavings=total_sav,
        currentInvestments=curr_inv,
        budgetUsed=budget_util,
        financialHealthScore=health_score,
        recentTransactions=recent_txs,
        expenseSummary=exp_summary,
        investmentSummary=inv_summary,
        savingsProgress=sav_progress
    )

def get_financial_health(db: Session, user: User) -> HealthScoreResponse:
    expenses = db.query(Expense).filter(Expense.userId == user.id).all()
    budgets = db.query(Budget).filter(Budget.userId == user.id).all()
    investments = db.query(Investment).filter(Investment.userId == user.id).all()

    income = user.monthlyIncome or Decimal("75000.00")
    total_exp = sum((e.amount for e in expenses), Decimal("0.00"))
    total_sav = max(Decimal("0.00"), income - total_exp)
    curr_inv = sum((i.currentValue or i.investedAmount for i in investments), Decimal("0.00"))
    total_limit = sum((b.monthlyLimit for b in budgets), Decimal("0.00"))
    total_spent = sum((b.spent or Decimal("0.00") for b in budgets), Decimal("0.00"))

    needs_categories = {"housing", "rent", "utilities", "bills", "groceries", "medical", "healthcare", "transport", "transportation", "education", "insurance"}
    needs_total = sum((e.amount for e in expenses if e.category and e.category.lower() in needs_categories), Decimal("0.00"))
    wants_total = max(Decimal("0.00"), total_exp - needs_total)

    needs_pct = float(round((needs_total / income * 100), 1)) if income > Decimal("0.00") else 0.0
    wants_pct = float(round((wants_total / income * 100), 1)) if income > Decimal("0.00") else 0.0
    savings_pct = float(round((total_sav / income * 100), 1)) if income > Decimal("0.00") else 0.0

    liquid_inv = sum((i.currentValue or i.investedAmount for i in investments if i.type in ["Mutual Funds", "Gold", "Savings", "Bonds"]), Decimal("0.00"))
    emergency_runway = float(round((total_sav + liquid_inv) / total_exp, 1)) if total_exp > Decimal("0.00") else 6.0

    budget_util = int(round(float(total_spent / total_limit) * 100)) if total_limit > Decimal("0.00") else 0
    sav_score = min(100, int((float(total_sav / income) if income > Decimal("0.00") else 0.0) * 200))
    bud_score = max(40, 100 - (40 if budget_util > 100 else (20 if budget_util > 80 else 0)))
    inv_score = 82 if curr_inv > Decimal("0.00") else 50
    debt_score = 70

    score = int(round(sav_score * 0.35 + bud_score * 0.25 + inv_score * 0.25 + debt_score * 0.15))
    recs = generate_recommendations(user, expenses, budgets, investments)

    return HealthScoreResponse(
        score=score,
        savingsScore=sav_score,
        budgetScore=bud_score,
        investmentScore=inv_score,
        debtScore=debt_score,
        needsPct=needs_pct,
        wantsPct=wants_pct,
        savingsPct=savings_pct,
        emergencyRunwayMonths=emergency_runway,
        recommendations=recs
    )

def get_spending_analytics(db: Session, user: User) -> Dict[str, Any]:
    import datetime
    from sqlalchemy import func
    
    today = datetime.date.today()
    expenses = db.query(Expense).filter(Expense.userId == user.id).all()
    
    first_day_curr_month = datetime.date(today.year, today.month, 1)
    curr_month_expenses = [e for e in expenses if e.date >= first_day_curr_month]
    
    category_totals = {}
    for e in curr_month_expenses:
        category_totals[e.category] = category_totals.get(e.category, Decimal("0.00")) + e.amount
    
    total_curr_spent = sum(category_totals.values(), Decimal("0.00"))
    
    if not category_totals and expenses:
        for e in expenses:
            category_totals[e.category] = category_totals.get(e.category, Decimal("0.00")) + e.amount
        total_curr_spent = sum(category_totals.values(), Decimal("0.00"))
    
    highest_cat = "N/A"
    highest_amt = Decimal("0.00")
    highest_pct = 0.0
    
    if category_totals:
        highest_cat, highest_amt = max(category_totals.items(), key=lambda x: x[1])
        if total_curr_spent > 0:
            highest_pct = float(highest_amt / total_curr_spent * 100)
            
    monthly_comparison = []
    total_sum_past_6 = Decimal("0.00")
    months_with_data = 0
    
    for i in range(5, -1, -1):
        m = today.month - i
        y = today.year
        if m <= 0:
            m += 12
            y -= 1
        start_date = datetime.date(y, m, 1)
        if m == 12:
            end_date = datetime.date(y + 1, 1, 1) - datetime.timedelta(days=1)
        else:
            end_date = datetime.date(y, m + 1, 1) - datetime.timedelta(days=1)
            
        m_expenses = [e for e in expenses if start_date <= e.date <= end_date]
        m_total = sum((e.amount for e in m_expenses), Decimal("0.00"))
        
        income = user.monthlyIncome or Decimal("75000.00")
        month_name = start_date.strftime("%b")
        
        monthly_comparison.append({
            "month": month_name,
            "expenses": float(m_total),
            "income": float(income),
            "savings": float(max(Decimal("0.00"), income - m_total))
        })
        
        if m_total > 0:
            total_sum_past_6 += m_total
            months_with_data += 1
            
    monthly_average = float(total_sum_past_6 / max(1, months_with_data))
    
    needs_categories = {"housing", "rent", "utilities", "bills", "groceries", "medical", "healthcare", "transport", "transportation", "education", "insurance"}
    needs_total = sum((e.amount for e in curr_month_expenses if e.category and e.category.lower() in needs_categories), Decimal("0.00"))
    wants_total = max(Decimal("0.00"), total_curr_spent - needs_total)
    
    needs_pct = float(needs_total / total_curr_spent * 100) if total_curr_spent > 0 else 50.0
    wants_pct = float(wants_total / total_curr_spent * 100) if total_curr_spent > 0 else 50.0
    
    if today.month == 1:
        prev_month_start = datetime.date(today.year - 1, 12, 1)
        prev_month_end = datetime.date(today.year, 1, 1) - datetime.timedelta(days=1)
    else:
        prev_month_start = datetime.date(today.year, today.month - 1, 1)
        prev_month_end = datetime.date(today.year, today.month, 1) - datetime.timedelta(days=1)
        
    prev_month_expenses = [e for e in expenses if prev_month_start <= e.date <= prev_month_end]
    prev_month_total = sum((e.amount for e in prev_month_expenses), Decimal("0.00"))
    
    if prev_month_total > 0:
        trend = ((total_curr_spent - prev_month_total) / prev_month_total) * 100
        trend_value = f"{'+' if trend >= 0 else ''}{float(trend):.1f}%"
        trend_is_positive = trend <= 0
    else:
        trend_value = "0.0%"
        trend_is_positive = True
        
    prev_month_name = prev_month_start.strftime("%B")
    
    sorted_curr_expenses = sorted(curr_month_expenses, key=lambda x: x.amount, reverse=True)
    outliers = []
    for e in sorted_curr_expenses[:2]:
        outliers.append({
            "id": e.id,
            "description": e.description,
            "amount": float(e.amount),
            "date": e.date.strftime("%Y-%m-%d"),
            "category": e.category,
            "notes": f"Logged on {e.date.strftime('%b %d')} • Large outlay",
            "tag": "Discretionary" if e.category.lower() not in needs_categories else "Fixed Need"
        })
        
    colors = {
        "Food": "#f97316",
        "Travel": "#06b6d4",
        "Shopping": "#ec4899",
        "Bills": "#eab308",
        "Education": "#8b5cf6",
        "Healthcare": "#10b981",
        "Entertainment": "#6366f1",
        "Other": "#64748b"
    }
    category_spending_list = []
    for cat, amt in category_totals.items():
        category_spending_list.append({
            "name": cat,
            "value": float(amt),
            "color": colors.get(cat, "#3b82f6")
        })
        
    weekly_comparison = []
    for i in range(7, -1, -1):
        start_of_week = today - datetime.timedelta(days=today.weekday() + i * 7)
        end_of_week = start_of_week + datetime.timedelta(days=6)
        
        w_expenses = [e for e in expenses if start_of_week <= e.date <= end_of_week]
        w_total = sum((e.amount for e in w_expenses), Decimal("0.00"))
        
        week_label = f"{start_of_week.strftime('%b %d')}"
        
        weekly_comparison.append({
            "month": week_label,
            "expenses": float(w_total),
            "income": float((user.monthlyIncome or Decimal("75000.00")) / 4),
            "savings": float(max(Decimal("0.00"), ((user.monthlyIncome or Decimal("75000.00")) / 4) - w_total))
        })

    return {
        "highestCategoryName": highest_cat,
        "highestCategoryAmount": float(highest_amt),
        "highestCategoryPercentage": float(highest_pct),
        "monthlyAverage": float(monthly_average),
        "discretionaryPct": float(wants_pct),
        "fixedPct": float(needs_pct),
        "ratioString": f"{int(round(wants_pct))}% / {int(round(needs_pct))}%",
        "trendValue": trend_value,
        "trendIsPositive": trend_is_positive,
        "trendSubtitle": f"vs ₹{float(prev_month_total):,.0f} in {prev_month_name}",
        "categorySpending": category_spending_list,
        "monthlyComparison": monthly_comparison,
        "weeklyComparison": weekly_comparison,
        "outliers": outliers
    }

def get_budget_recommendations(db: Session, user: User) -> Dict[str, Any]:
    import datetime
    today = datetime.date.today()
    income = user.monthlyIncome or Decimal("75000.00")
    
    budgets = db.query(Budget).filter(Budget.userId == user.id).all()
    expenses = db.query(Expense).filter(Expense.userId == user.id).all()
    
    first_day_curr_month = datetime.date(today.year, today.month, 1)
    curr_month_expenses = [e for e in expenses if e.date >= first_day_curr_month]
    
    needs_categories = {"housing", "rent", "utilities", "bills", "groceries", "medical", "healthcare", "transport", "transportation", "education", "insurance"}
    needs_total = sum((e.amount for e in curr_month_expenses if e.category and e.category.lower() in needs_categories), Decimal("0.00"))
    wants_total = sum((e.amount for e in curr_month_expenses if e.category and e.category.lower() not in needs_categories), Decimal("0.00"))
    total_spent = needs_total + wants_total
    savings_total = max(Decimal("0.00"), income - total_spent)
    
    needs_pct = float(needs_total / income * 100) if income > 0 else 0.0
    wants_pct = float(wants_total / income * 100) if income > 0 else 0.0
    savings_pct = float(savings_total / income * 100) if income > 0 else 0.0
    
    recommended_budgets = []
    potential_savings = Decimal("0.00")
    overspending_count = 0
    
    for b in budgets:
        cat_expenses = [e for e in curr_month_expenses if e.category == b.category]
        curr_spend = sum((e.amount for e in cat_expenses), Decimal("0.00"))
        
        if curr_spend > b.monthlyLimit:
            recommended_limit = Decimal(str(int(float(b.monthlyLimit) * 0.9 / 100) * 100))
            if recommended_limit <= 0:
                recommended_limit = b.monthlyLimit
            action = f"Reduce by ₹{float(curr_spend - recommended_limit):.0f}"
            rationale = f"Exceeded limit of ₹{float(b.monthlyLimit):,.0f} by ₹{float(curr_spend - b.monthlyLimit):,.0f}. Trimming non-essential items is recommended."
            overspending_count += 1
            potential_savings += max(Decimal("0.00"), curr_spend - recommended_limit)
        elif b.category.lower() == 'food' and curr_spend > income * Decimal('0.12'):
            recommended_limit = Decimal(str(int(float(income) * 0.10 / 100) * 100))
            action = f"Reduce by ₹{float(curr_spend - recommended_limit):.0f}"
            rationale = f"Food spending is higher than average (currently {float(curr_spend/income*100):.1f}% of income). Cap at ₹{float(recommended_limit):,.0f}."
            potential_savings += max(Decimal("0.00"), curr_spend - recommended_limit)
        elif b.category.lower() == 'shopping' and curr_spend > income * Decimal('0.08'):
            recommended_limit = Decimal(str(int(float(income) * 0.06 / 100) * 100))
            action = f"Cap at ₹{float(recommended_limit):,.0f}"
            rationale = f"Retail spend is high this month. Recommend capping at ₹{float(recommended_limit):,.0f}."
            potential_savings += max(Decimal("0.00"), curr_spend - recommended_limit)
        else:
            recommended_limit = b.monthlyLimit
            action = "Maintain buffer"
            rationale = f"Category spending is within healthy boundaries. Set buffer limit at ₹{float(b.monthlyLimit):,.0f}."
            
        recommended_budgets.append({
            "category": b.category,
            "currentSpend": float(curr_spend),
            "recommendedLimit": float(recommended_limit),
            "rationale": rationale,
            "action": action
        })
        
    total_recommended_limit = sum(Decimal(str(r["recommendedLimit"])) for r in recommended_budgets)
    recommended_monthly_budget = total_recommended_limit if total_recommended_limit > 0 else income * Decimal('0.55')
    suggested_monthly_savings = max(Decimal("0.00"), income - recommended_monthly_budget)
    
    total_limit = sum((b.monthlyLimit for b in budgets), Decimal("0.00"))
    total_spent_budget = sum((b.spent or Decimal("0.00") for b in budgets), Decimal("0.00"))
    budget_utilization = int(round(float(total_spent_budget / total_limit) * 100)) if total_limit > 0 else 0
    
    return {
        "budgetUtilization": budget_utilization,
        "overspendingAlerts": overspending_count > 0,
        "overspendingCategoriesCount": overspending_count,
        "recommendedMonthlyBudget": float(recommended_monthly_budget),
        "suggestedMonthlySavings": float(suggested_monthly_savings),
        "potentialMonthlySavings": float(potential_savings),
        "recommendedBudgets": recommended_budgets,
        "needsPct": float(needs_pct),
        "wantsPct": float(wants_pct),
        "savingsPct": float(savings_pct)
    }

def get_investment_insights(db: Session, user: User) -> Dict[str, Any]:
    investments = db.query(Investment).filter(Investment.userId == user.id).all()
    
    total_invested = sum((i.investedAmount for i in investments), Decimal("0.00"))
    total_value = sum((i.currentValue or i.investedAmount for i in investments), Decimal("0.00"))
    
    best_perf = None
    best_pct = -999999.0
    worst_perf = None
    worst_pct = 999999.0
    
    for i in investments:
        gain = (i.currentValue or i.investedAmount) - i.investedAmount
        pct = float(gain / i.investedAmount * 100) if i.investedAmount > 0 else 0.0
        
        if pct > best_pct:
            best_pct = pct
            best_perf = i
        if pct < worst_pct:
            worst_pct = pct
            worst_perf = i
            
    best_name = best_perf.name if best_perf else "N/A"
    best_return = (f"+{best_pct:.1f}%" if best_pct >= 0 else f"{best_pct:.1f}%") if best_perf else "0.0%"
    best_gain = f"₹{float((best_perf.currentValue or best_perf.investedAmount) - best_perf.investedAmount):,.0f} gain" if best_perf else "₹0 gain"
    
    worst_name = worst_perf.name if worst_perf else "N/A"
    worst_return = (f"+{worst_pct:.1f}%" if worst_pct >= 0 else f"{worst_pct:.1f}%") if worst_perf else "0.0%"
    worst_gain = f"₹{float((worst_perf.currentValue or worst_perf.investedAmount) - worst_perf.investedAmount):,.0f} gain" if worst_perf else "₹0 gain"
    
    unique_types = set(i.type for i in investments)
    num_types = len(unique_types)
    div_score = min(10.0, float(num_types) * 2.0) if num_types > 0 else 0.0
    
    if not investments:
        div_subtitle = "No investments added yet"
    elif div_score >= 8.0:
        div_subtitle = f"Well balanced across {num_types} types"
    elif div_score >= 5.0:
        div_subtitle = f"Moderately diversified across {num_types} types"
    else:
        div_subtitle = f"Concentrated in only {num_types} type(s)"
        
    betas = {
        "Stocks": 1.2,
        "Mutual Funds": 1.0,
        "ETFs": 0.9,
        "Bonds": 0.1,
        "Other": 0.5,
        "Other Investments": 0.5
    }
    
    weighted_beta = 1.0
    if total_value > 0:
        total_beta_val = sum(Decimal(str(betas.get(i.type, 1.0))) * (i.currentValue or i.investedAmount) for i in investments)
        weighted_beta = float(total_beta_val / total_value)
        
    if not investments:
        beta_subtitle = "No beta context"
    elif weighted_beta < 0.5:
        beta_subtitle = "Defensive low risk portfolio"
    elif weighted_beta < 0.95:
        beta_subtitle = "Lower risk than broader Nifty"
    elif weighted_beta <= 1.05:
        beta_subtitle = "Market tracking risk profile"
    else:
        beta_subtitle = "High volatility equity portfolio"
        
    equity_value = sum(((i.currentValue or i.investedAmount) for i in investments if i.type.lower() in ["stocks", "mutual funds", "equity"]), Decimal("0.00"))
    equity_pct = float(equity_value / total_value * 100) if total_value > 0 else 0.0
    
    if not investments:
        diagnostic_title = "No investments added yet"
        diagnostic_msg = "Add mutual funds, stocks, or other assets to see portfolio risk analysis and smart recommendations."
    elif equity_pct > 60.0:
        diagnostic_title = f"Your portfolio is heavily concentrated in domestic equities ({equity_pct:.0f}%)."
        diagnostic_msg = "While equity allocation delivers superior long-term wealth compounding, market drawdowns could increase short-term volatility. We recommend directing future monthly SIP inflows into Sovereign Gold Bonds (SGB) or short-term liquid debt instruments."
    else:
        diagnostic_title = f"Your portfolio has a balanced allocation ({equity_pct:.0f}% equities)."
        diagnostic_msg = "Your current asset allocation is well diversified between growth and defensive assets, helping buffer against sudden market corrections while maintaining healthy long-term upside."
        
    inv_summary = {}
    for i in investments:
        val = i.currentValue or i.investedAmount
        inv_summary[i.type] = inv_summary.get(i.type, Decimal("0.00")) + val
        
    inv_summary_float = {k: float(v) for k, v in inv_summary.items()}
    
    return {
        "currentInvestments": float(total_value),
        "investmentBreakdown": inv_summary_float,
        "bestPerformerName": best_name,
        "bestPerformerReturnPct": best_return,
        "bestPerformerGain": best_gain,
        "worstPerformerName": worst_name,
        "worstPerformerReturnPct": worst_return,
        "worstPerformerGain": worst_gain,
        "diversificationScore": float(div_score),
        "diversificationSubtitle": div_subtitle,
        "portfolioBeta": float(weighted_beta),
        "portfolioBetaSubtitle": beta_subtitle,
        "equityConcentration": float(equity_pct),
        "diagnosticAlert": {
            "title": diagnostic_title,
            "message": diagnostic_msg
        }
    }
