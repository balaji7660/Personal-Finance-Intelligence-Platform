from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from decimal import Decimal
from datetime import date, datetime
import os
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.security import get_password_hash
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.investment import Investment
from app.models.goal import Goal
from app.models.notification import Notification
from app.models.recurring_expense import RecurringExpense

from app.routers import auth, users, expenses, budgets, investments, goals, analytics, reports, notifications, tax, recurring

# Auto create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration - Allow all origins for Vercel/Render deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(expenses.router)
app.include_router(budgets.router)
app.include_router(investments.router)
app.include_router(goals.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(notifications.router)
app.include_router(tax.router)
app.include_router(recurring.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }
