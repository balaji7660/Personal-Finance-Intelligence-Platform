# FinSight — Personal Finance Management & Intelligence System

FinSight is a production-ready, full-stack Personal Finance Management & Financial Intelligence SaaS application built using **React, Vite, Tailwind CSS, Recharts, Python 3, FastAPI, SQLAlchemy, JWT Authentication, and SQLite / MySQL**.

---

## 🌟 Architecture Overview

```text
FinSight
│
├── src/
│   ├── React 18 + Vite 6
│   ├── Components (Cards, Charts, Tables, Common UI)
│   ├── Pages (Auth, Dashboard, Expenses, Budgets, Investments, Goals, Analytics, Reports, Notifications, Profile)
│   ├── Context (AuthContext, FinanceContext, ThemeContext)
│   ├── Services (Axios HTTP client connected to REST APIs)
│   └── Routing (React Router DOM v6 with Protected Routes)
│
├── backend/
│   ├── Python 3.13 + FastAPI + Uvicorn
│   ├── app/routers/ (REST endpoints for Auth, User, Expenses, Budgets, Investments, Goals, Analytics, Reports, Notifications)
│   ├── app/services/ (Business logic, financial calculations, recommendation engine)
│   ├── app/models/ (SQLAlchemy ORM models)
│   ├── app/schemas/ (Pydantic DTOs & Validation)
│   ├── app/core/ (Database connection pool & JWT Security)
│   └── run.py (FastAPI entrypoint)
│
├── database/
│   └── db.sql (Database schema & definitions)
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3 & Vite 6.1
- **Styling**: Tailwind CSS v3 with dark mode (`class`), custom glassmorphism, and semantic financial tokens
- **Data Visualization**: Recharts (`recharts`)
- **Icons**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios (`axios`) with JWT Bearer Interceptors
- **Routing**: React Router DOM (`react-router-dom` v6)

### Backend
- **Framework**: Python 3 & FastAPI
- **Server**: Uvicorn (`uvicorn`)
- **Security**: PyJWT (`python-jose`) & `bcrypt` password hashing
- **Data Access**: SQLAlchemy 2.0 ORM
- **Validation**: Pydantic v2 schemas (`pydantic`)

### Database
- **Engine**: SQLite / MySQL Server
- **Database File**: `backend/finsight.db` (Auto-fallback to SQLite when MySQL is offline)

---

## 🔑 Core Features & REST API Endpoints

### 1. Authentication & Security (`/api/auth`)
- `POST /api/auth/register` — User registration with currency, monthly income, risk preference.
- `POST /api/auth/login` — Authenticate credentials and issue JWT bearer token.
- `POST /api/auth/forgot-password` — Issue OTP verification code.
- `POST /api/auth/verify-otp` — Verify OTP token.
- `POST /api/auth/reset-password` — Reset account password.

### 2. User Profile (`/api/users`)
- `GET /api/users/profile` — Fetch current user details.
- `PUT /api/users/profile` — Update monthly income, preferred currency, or risk profile.

### 3. Expense Management (`/api/expenses`)
- `GET /api/expenses` — List user's expenses.
- `GET /api/expenses/{id}` — Fetch specific expense detail.
- `POST /api/expenses` — Create new expense.
- `PUT /api/expenses/{id}` — Update expense record.
- `DELETE /api/expenses/{id}` — Delete expense record.

### 4. Budget Management (`/api/budgets`)
- `GET /api/budgets` — List category budget limits and spent totals.
- `POST /api/budgets` — Create new budget guardrail.
- `PUT /api/budgets/{id}` — Modify budget limit.
- `DELETE /api/budgets/{id}` — Delete budget ceiling.

### 5. Investment Portfolio (`/api/investments`)
- `GET /api/investments` — Retrieve active holdings across Stocks, Mutual Funds, ETFs, Bonds, and Gold.
- `POST /api/investments` — Add new investment holding.
- `PUT /api/investments/{id}` — Update valuation or quantity.
- `DELETE /api/investments/{id}` — Sell/remove asset position.

### 6. Financial Goals (`/api/goals`)
- `GET /api/goals` — Track Emergency Fund, House, Car, Travel, and Retirement targets.
- `POST /api/goals` — Set new financial goal milestone.
- `PUT /api/goals/{id}` — Log saved contributions.
- `DELETE /api/goals/{id}` — Remove goal.

### 7. Analytics & Intelligence (`/api/analytics`)
- `GET /api/analytics` — Computes 6-month monthly cashflow comparison, category distribution, asset allocation breakdown, dynamic AI recommendations, and Financial Health Score (0–100).

### 8. Financial Reports (`/api/reports`)
- `GET /api/reports/financial` — Consolidated net worth and asset breakdown report.

### 9. Notifications (`/api/notifications`)
- `GET /api/notifications` — Fetch user alerts and reminders.
- `PUT /api/notifications/{id}/read` — Mark notification read.
- `PUT /api/notifications/read-all` — Mark all notifications read.
- `DELETE /api/notifications/{id}` — Delete notification.

---

## ⚡ How to Run the Application

### 1. Start Python FastAPI Backend Server
Navigate to the `backend/` directory and run:
```bash
cd backend
python run.py
```
The backend server will start on `http://localhost:8000`.

### 2. Start React Frontend Dev Server
In another terminal, run:
```bash
npm run dev
```
The frontend application will start on `http://localhost:5173/`.

---

## 🧪 Production Verification

### Frontend Production Build
```bash
cmd /c npm run build
```
