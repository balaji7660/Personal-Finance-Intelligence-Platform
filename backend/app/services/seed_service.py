from sqlalchemy.orm import Session
from decimal import Decimal
import datetime
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.investment import Investment
from app.models.goal import Goal
from app.models.notification import Notification

def seed_user_data(db: Session, user_id: int):
    # Get current date
    today = datetime.date.today()
    first_day = datetime.date(today.year, today.month, 1)
    if today.month == 12:
        last_day = datetime.date(today.year + 1, 1, 1) - datetime.timedelta(days=1)
    else:
        last_day = datetime.date(today.year, today.month + 1, 1) - datetime.timedelta(days=1)

    first_day_str = first_day.strftime("%Y-%m-%d")
    last_day_str = last_day.strftime("%Y-%m-%d")

    # 1. Seed Budgets for current month
    budgets_data = [
        {"name": "Monthly Food & Groceries", "category": "Food", "monthlyLimit": 12000, "spent": 9850, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Travel & Commute Allowance", "category": "Travel", "monthlyLimit": 6000, "spent": 4400, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Shopping & Lifestyle", "category": "Shopping", "monthlyLimit": 8000, "spent": 7200, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Utility Bills & Maintenance", "category": "Bills", "monthlyLimit": 9000, "spent": 7700, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Education & Professional Upskilling", "category": "Education", "monthlyLimit": 5000, "spent": 2199, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Healthcare & Wellness", "category": "Healthcare", "monthlyLimit": 10000, "spent": 8250, "startDate": first_day_str, "endDate": last_day_str},
        {"name": "Entertainment & Leisure", "category": "Entertainment", "monthlyLimit": 4000, "spent": 2649, "startDate": first_day_str, "endDate": last_day_str}
    ]

    for b in budgets_data:
        budget = Budget(
            userId=user_id,
            name=b["name"],
            category=b["category"],
            monthlyLimit=Decimal(str(b["monthlyLimit"])),
            spent=Decimal(str(b["spent"])),
            startDate=datetime.datetime.strptime(b["startDate"], "%Y-%m-%d").date(),
            endDate=datetime.datetime.strptime(b["endDate"], "%Y-%m-%d").date() if b["endDate"] else None
        )
        db.add(budget)

    # 2. Seed Expenses relative to today
    expenses_data = [
        {"description": "Swiggy Gourmet Dinner & Groceries", "amount": 1450, "category": "Food", "date": (today - datetime.timedelta(days=2)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Family dinner order"},
        {"description": "Uber Office Commute (Weekly Pass)", "amount": 1200, "category": "Travel", "date": (today - datetime.timedelta(days=3)).strftime("%Y-%m-%d"), "paymentMethod": "Credit Card", "notes": "Cab commute to tech park"},
        {"description": "Amazon Great Freedom Festival Shopping", "amount": 4850, "category": "Shopping", "date": (today - datetime.timedelta(days=5)).strftime("%Y-%m-%d"), "paymentMethod": "Credit Card", "notes": "Ergonomic mouse and home essentials"},
        {"description": "Electricity & Broadband Bill (Airtel Xstream)", "amount": 3200, "category": "Bills", "date": (today - datetime.timedelta(days=7)).strftime("%Y-%m-%d"), "paymentMethod": "Bank Transfer", "notes": "Utility payments"},
        {"description": "Coursera & Udemy AI Masterclass", "amount": 2199, "category": "Education", "date": (today - datetime.timedelta(days=9)).strftime("%Y-%m-%d"), "paymentMethod": "Debit Card", "notes": "Professional upskilling"},
        {"description": "Apollo Pharmacy Medical Supplies & Tests", "amount": 1750, "category": "Healthcare", "date": (today - datetime.timedelta(days=11)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Annual health check tests"},
        {"description": "PVR IMAX Movie Tickets & Popcorn", "amount": 1650, "category": "Entertainment", "date": (today - datetime.timedelta(days=13)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Weekend movie with friends"},
        {"description": "Blue Tokai Specialty Coffee Beans", "amount": 850, "category": "Food", "date": (today - datetime.timedelta(days=15)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Home roasted coffee"},
        {"description": "Cult.fit Gym & Fitness Quarterly Pass", "amount": 6500, "category": "Healthcare", "date": (today - datetime.timedelta(days=18)).strftime("%Y-%m-%d"), "paymentMethod": "Credit Card", "notes": "Fitness center subscription"},
        {"description": "Apartment Maintenance & Water Bill", "amount": 4500, "category": "Bills", "date": (today - datetime.timedelta(days=22)).strftime("%Y-%m-%d"), "paymentMethod": "Bank Transfer", "notes": "Society maintenance charges"},
        {"description": "Blinkit Instant Groceries Delivery", "amount": 1120, "category": "Food", "date": (today - datetime.timedelta(days=25)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Daily dairy and vegetables"},
        {"description": "Petrol Refuel for Car (Shell Fuel)", "amount": 3200, "category": "Travel", "date": (today - datetime.timedelta(days=29)).strftime("%Y-%m-%d"), "paymentMethod": "Credit Card", "notes": "Full tank refuel"},
        {"description": "Zara Casual Wear & Footwear", "amount": 5490, "category": "Shopping", "date": (today - datetime.timedelta(days=33)).strftime("%Y-%m-%d"), "paymentMethod": "Credit Card", "notes": "Office casual clothing"},
        {"description": "Netflix & Spotify Premium Family Plan", "amount": 999, "category": "Entertainment", "date": (today - datetime.timedelta(days=38)).strftime("%Y-%m-%d"), "paymentMethod": "Debit Card", "notes": "Monthly digital subscriptions"},
        {"description": "Donation to Animal Rescue NGO", "amount": 2000, "category": "Other", "date": (today - datetime.timedelta(days=45)).strftime("%Y-%m-%d"), "paymentMethod": "UPI", "notes": "Charitable donation 80G"}
    ]

    for e in expenses_data:
        expense = Expense(
            userId=user_id,
            amount=Decimal(str(e["amount"])),
            date=datetime.datetime.strptime(e["date"], "%Y-%m-%d").date(),
            category=e["category"],
            paymentMethod=e["paymentMethod"],
            description=e["description"],
            notes=e["notes"],
            status="Completed"
        )
        db.add(expense)

    # 3. Seed Investments
    investments_data = [
        {"name": "HDFC Nifty 50 Index Fund", "type": "Mutual Funds", "investedAmount": 85000, "currentValue": 104200, "purchaseDate": (today - datetime.timedelta(days=530)).strftime("%Y-%m-%d"), "quantity": 650.42, "riskLevel": "Moderate", "notes": "Monthly SIP of ₹5,000"},
        {"name": "Tata Consultancy Services (TCS)", "type": "Stocks", "investedAmount": 45000, "currentValue": 53800, "purchaseDate": (today - datetime.timedelta(days=650)).strftime("%Y-%m-%d"), "quantity": 14, "riskLevel": "Low", "notes": "Large cap IT blue chip"},
        {"name": "Reliance Industries Ltd", "type": "Stocks", "investedAmount": 40000, "currentValue": 46200, "purchaseDate": (today - datetime.timedelta(days=580)).strftime("%Y-%m-%d"), "quantity": 16, "riskLevel": "Moderate", "notes": "Core long term holding"},
        {"name": "Nippon India Gold ETF (BeES)", "type": "ETFs", "investedAmount": 35000, "currentValue": 41500, "purchaseDate": (today - datetime.timedelta(days=510)).strftime("%Y-%m-%d"), "quantity": 620, "riskLevel": "Low", "notes": "Hedge against market inflation"},
        {"name": "RBI Floating Rate Savings Bonds", "type": "Bonds", "investedAmount": 30000, "currentValue": 32400, "purchaseDate": (today - datetime.timedelta(days=720)).strftime("%Y-%m-%d"), "quantity": 30, "riskLevel": "Low", "notes": "Government backed sovereign bond"},
        {"name": "Parag Parikh Flexi Cap Fund", "type": "Mutual Funds", "investedAmount": 50000, "currentValue": 64500, "purchaseDate": (today - datetime.timedelta(days=560)).strftime("%Y-%m-%d"), "quantity": 710.15, "riskLevel": "Moderate", "notes": "Diversified global and Indian equity fund"},
        {"name": "Sovereign Gold Bond (SGB 2024-Series)", "type": "Other Investments", "investedAmount": 25000, "currentValue": 31200, "purchaseDate": (today - datetime.timedelta(days=470)).strftime("%Y-%m-%d"), "quantity": 4, "riskLevel": "Low", "notes": "2.5% annual interest + capital appreciation"}
    ]

    for i in investments_data:
        investment = Investment(
            userId=user_id,
            name=i["name"],
            type=i["type"],
            investedAmount=Decimal(str(i["investedAmount"])),
            currentValue=Decimal(str(i["currentValue"])) if i["currentValue"] else None,
            purchaseDate=datetime.datetime.strptime(i["purchaseDate"], "%Y-%m-%d").date(),
            quantity=Decimal(str(i["quantity"])) if i["quantity"] else None,
            riskLevel=i["riskLevel"],
            notes=i["notes"]
        )
        db.add(investment)

    # 4. Seed Goals relative to today
    travel_target_date = today + datetime.timedelta(days=240)
    travel_target_str = travel_target_date.strftime("%B %Y")
    
    goals_data = [
        {"name": "Emergency Fund (6 Months Expenses)", "type": "Emergency Fund", "targetAmount": 250000, "savedAmount": 185000, "targetDate": (today + datetime.timedelta(days=120)).strftime("%Y-%m-%d"), "priority": "High", "notes": "Parked in high yield liquid funds and FD"},
        {"name": "Japan & Bali Vacation Trip", "type": "Travel", "targetAmount": 150000, "savedAmount": 90000, "targetDate": travel_target_date.strftime("%Y-%m-%d"), "priority": "Medium", "notes": "Flights and hotel accommodation fund"},
        {"name": "Electric Vehicle (Tata Nexon EV) Downpayment", "type": "Car", "targetAmount": 400000, "savedAmount": 220000, "targetDate": (today + datetime.timedelta(days=420)).strftime("%Y-%m-%d"), "priority": "High", "notes": "Target 30% downpayment to reduce loan EMI"},
        {"name": "Luxury Apartment Down Payment", "type": "House", "targetAmount": 1500000, "savedAmount": 450000, "targetDate": (today + datetime.timedelta(days=1200)).strftime("%Y-%m-%d"), "priority": "High", "notes": "Long term home savings plan"},
        {"name": "Retirement Wealth Corpus", "type": "Retirement", "targetAmount": 20000000, "savedAmount": 2800000, "targetDate": (today + datetime.timedelta(days=6800)).strftime("%Y-%m-%d"), "priority": "High", "notes": "NPS, EPF, and equity index SIP compounders"}
    ]

    for g in goals_data:
        goal = Goal(
            userId=user_id,
            name=g["name"],
            type=g["type"],
            targetAmount=Decimal(str(g["targetAmount"])),
            savedAmount=Decimal(str(g["savedAmount"])),
            targetDate=datetime.datetime.strptime(g["targetDate"], "%Y-%m-%d").date(),
            priority=g["priority"],
            notes=g["notes"]
        )
        db.add(goal)

    # 5. Seed Notifications relative to today
    notifications_data = [
        {"title": "Budget Alert: Food & Groceries", "message": "Your Food budget is 82% used. Consider monitoring non-essential dining expenses.", "type": "warning", "timestamp": (today - datetime.timedelta(days=1)).strftime("%Y-%m-%d") + "T10:30:00Z", "read": False},
        {"title": "Savings Milestone Reached", "message": "Congratulations! Your monthly savings increased by 12% compared to last month.", "type": "success", "timestamp": (today - datetime.timedelta(days=2)).strftime("%Y-%m-%d") + "T16:45:00Z", "read": False},
        {"title": "Investment Portfolio Growth", "message": "Your investment portfolio value increased by ₹4,500 (+1.8%) this week.", "type": "info", "timestamp": (today - datetime.timedelta(days=3)).strftime("%Y-%m-%d") + "T09:15:00Z", "read": False},
        {"title": "Goal Progress Update", "message": f"Your Travel Goal (Japan Vacation) is now 60% completed. You are on track for {travel_target_str}.", "type": "success", "timestamp": (today - datetime.timedelta(days=4)).strftime("%Y-%m-%d") + "T14:20:00Z", "read": True},
        {"title": "Bill Reminder: Airtel Broadband", "message": "Upcoming bill due date in 3 days for broadband service.", "type": "warning", "timestamp": (today - datetime.timedelta(days=7)).strftime("%Y-%m-%d") + "T11:00:00Z", "read": True}
    ]

    for n in notifications_data:
        notification = Notification(
            userId=user_id,
            title=n["title"],
            message=n["message"],
            type=n["type"],
            read=n["read"],
            timestamp=datetime.datetime.strptime(n["timestamp"], "%Y-%m-%dT%H:%M:%SZ")
        )
        db.add(notification)

    db.commit()
