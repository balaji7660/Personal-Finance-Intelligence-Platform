# FinSight - Modern Personal Finance Management & Intelligence Dashboard

FinSight is a production-grade personal finance management and wealth intelligence web application built with **React**, **Vite**, **Tailwind CSS**, **Recharts**, **Lucide Icons**, and **Context API**.

Designed specifically with modern fintech design principles and tailored for the Indian financial ecosystem with native Indian Rupee (`₹`) support.

---

## 🌟 Key Features

1. **Executive Financial Dashboard**
   - 6 Key Performance Metric cards (Income, Expenses, Net Savings, Investments, Budget Utilization, Financial Health Score 78/100).
   - Recharts visual analytics: Monthly Cash Flow (Income vs Expense vs Savings), Expense Trends, Category Pie/Donut Breakdown, Portfolio Alpha vs Nifty 50.
   - Quick action triggers: Add Expense, Create Budget, Add Investment, Create Goal.
   - Recent verified transactions audit feed.

2. **Full Expense Management**
   - Itemized expense tracking with merchant descriptions, notes, and payment channels (UPI, Credit Card, Debit Card, Net Banking).
   - Categorized under: Food, Travel, Shopping, Bills, Education, Healthcare, Entertainment, Other.
   - Real-time search, category filtering, sort by date/amount, and CSV export.
   - Add, Edit, and Delete operations with confirmation dialogs.

3. **Smart Budget Management**
   - Category budget caps with real-time utilization progress bars.
   - Automatic visual warning banners when spending exceeds **80%** threshold or exceeds budget.
   - Detailed category drill-down pages with historical expenditure listings.

4. **Investment Portfolio Tracker**
   - Multi-asset tracking across Mutual Funds, Direct Equities (Stocks), ETFs (Gold BeES), Government Bonds (RBI Floating Rate), and Sovereign Gold Bonds (SGB).
   - Real-time Profit/Loss and CAGR/Absolute return calculations.
   - Asset allocation analysis and diversification rebalancing suggestions.

5. **Financial Goals & Life Milestones**
   - Milestone tracking for Emergency Funds, Vacations, Vehicle downpayments, and Retirement corpuses.
   - Dynamic monthly required savings calculator with target date forecasting.
   - Goal deposit/contribution tracker.

6. **Analytics & AI Financial Intelligence**
   - Spending behavior diagnostics detecting anomalies and month-on-month category inflation.
   - 50/30/20 budget rule alignment analysis.
   - Portfolio alpha trajectory vs benchmark index.
   - 100-Point Financial Health Score breakdown across Savings, Budgeting, Investments, and Debt.

7. **Downloadable & Printable Audit Reports**
   - Master Financial Balance Sheet, Expense Audit, Investment Portfolio Statement, and Goal Reports.
   - Instant CSV export and print-ready PDF styling.

8. **Notification Center**
   - Interactive notification drawer and dedicated notification manager.
   - Mark as read, mark all as read, delete, and alert category filters.

9. **Profile & Security Center**
   - Identity details, monthly income, default currency, and risk tolerance profile.
   - Two-Factor Authentication (2FA) toggle, password change, and active session manager.
   - Light & Dark mode support with persistence.

---

## 🚀 Tech Stack

- **Frontend Core**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Navigation & Routing**: React Router DOM (v6) with Protected Routes
- **Charts & Data Visualization**: Recharts
- **Iconography**: Lucide React
- **HTTP Client**: Axios (with centralized `api.js` client and interceptors)
- **State Management**: React Context API (`AuthContext`, `FinanceContext`, `ThemeContext`)
- **Currency & Formatting**: Indian Numbering Format (`Intl.NumberFormat('en-IN')` with ₹)

---

## 📂 File & Directory Structure

```
c:\Users\BALAJI\OneDrive\Desktop\Hanif project\
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── BudgetCard.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   ├── InvestmentCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── charts/
│   │   │   ├── AssetAllocationChart.jsx
│   │   │   ├── CategoryPieChart.jsx
│   │   │   ├── ExpenseTrendChart.jsx
│   │   │   ├── HealthScoreGauge.jsx
│   │   │   ├── IncomeExpenseChart.jsx
│   │   │   └── InvestmentPerformanceChart.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PageHeader.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Select.jsx
│   │   │   └── Toast.jsx
│   │   ├── layout/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── MobileSidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   └── Sidebar.jsx
│   │   └── tables/
│   │       ├── ExpenseTable.jsx
│   │       ├── PortfolioTable.jsx
│   │       └── RecentTransactionsTable.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── FinanceContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useFinance.js
│   │   └── useTheme.js
│   ├── layouts/
│   │   ├── AuthLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── analytics/
│   │   │   ├── Analytics.jsx
│   │   │   ├── BudgetRecommendations.jsx
│   │   │   ├── FinancialHealth.jsx
│   │   │   ├── InvestmentInsights.jsx
│   │   │   └── SpendingAnalysis.jsx
│   │   ├── auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyOTP.jsx
│   │   ├── budgets/
│   │   │   ├── BudgetDetails.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── CreateBudget.jsx
│   │   │   └── EditBudget.jsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── expenses/
│   │   │   ├── AddExpense.jsx
│   │   │   ├── EditExpense.jsx
│   │   │   ├── ExpenseHistory.jsx
│   │   │   └── Expenses.jsx
│   │   ├── goals/
│   │   │   ├── CreateGoal.jsx
│   │   │   ├── EditGoal.jsx
│   │   │   ├── GoalDetails.jsx
│   │   │   └── Goals.jsx
│   │   ├── investments/
│   │   │   ├── AddInvestment.jsx
│   │   │   ├── AssetAllocation.jsx
│   │   │   ├── InvestmentDetails.jsx
│   │   │   ├── Investments.jsx
│   │   │   └── Portfolio.jsx
│   │   ├── notifications/
│   │   │   └── Notifications.jsx
│   │   ├── profile/
│   │   │   ├── Preferences.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Security.jsx
│   │   └── NotFound.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── budgetService.js
│   │   ├── expenseService.js
│   │   ├── goalService.js
│   │   ├── investmentService.js
│   │   ├── notificationService.js
│   │   ├── reportService.js
│   │   └── userService.js
│   ├── utils/
│   │   ├── currencyFormatter.js
│   │   ├── dateUtils.js
│   │   └── exportUtils.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🛠️ Installation & Running Locally

### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration:
```env
VITE_API_BASE_URL=https://api.finsight.app/v1
VITE_APP_NAME=FinSight
VITE_DEFAULT_CURRENCY=INR
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔗 Backend API Integration Layer

All API communications are centralized under `src/services/`. When connecting to a real backend, you only need to adjust the service functions (or uncomment the `apiClient` requests):

| Service | Endpoint | HTTP Method | Description |
|---|---|---|---|
| `authService.js` | `/auth/login` | `POST` | Authenticate user |
| `authService.js` | `/auth/register` | `POST` | Register new user |
| `authService.js` | `/auth/forgot-password` | `POST` | Dispatch OTP |
| `authService.js` | `/auth/reset-password` | `POST` | Reset user password |
| `expenseService.js` | `/expenses` | `GET`, `POST` | Fetch or create expenses |
| `expenseService.js` | `/expenses/:id` | `PUT`, `DELETE` | Update or delete expense |
| `budgetService.js` | `/budgets` | `GET`, `POST` | Fetch or create category budgets |
| `budgetService.js` | `/budgets/:id` | `PUT`, `DELETE` | Update or delete budget |
| `investmentService.js`| `/investments` | `GET`, `POST` | Fetch or create portfolio holdings |
| `goalService.js` | `/goals` | `GET`, `POST` | Fetch or update financial goals |
| `notificationService.js`| `/notifications` | `GET`, `PATCH` | Notification center |
| `userService.js` | `/users/profile` | `GET`, `PUT` | User profile & preferences |

---

## 💡 Demo Credentials (Pre-loaded)
- **Email**: `aarav.sharma@example.com`
- **Password**: `password123`
- **Verification OTP**: `123456`
