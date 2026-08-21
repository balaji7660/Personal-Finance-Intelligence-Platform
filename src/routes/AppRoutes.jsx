import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Layouts
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../components/layout/DashboardLayout'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import ResetPassword from '../pages/auth/ResetPassword'
import VerifyOTP from '../pages/auth/VerifyOTP'

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard'

// Expenses
import Expenses from '../pages/expenses/Expenses'
import AddExpense from '../pages/expenses/AddExpense'
import EditExpense from '../pages/expenses/EditExpense'
import ExpenseHistory from '../pages/expenses/ExpenseHistory'

// Budgets
import Budgets from '../pages/budgets/Budgets'
import CreateBudget from '../pages/budgets/CreateBudget'
import EditBudget from '../pages/budgets/EditBudget'
import BudgetDetails from '../pages/budgets/BudgetDetails'

// Investments
import Investments from '../pages/investments/Investments'
import Portfolio from '../pages/investments/Portfolio'
import AddInvestment from '../pages/investments/AddInvestment'
import InvestmentDetails from '../pages/investments/InvestmentDetails'
import AssetAllocation from '../pages/investments/AssetAllocation'

// Goals
import Goals from '../pages/goals/Goals'
import CreateGoal from '../pages/goals/CreateGoal'
import EditGoal from '../pages/goals/EditGoal'
import GoalDetails from '../pages/goals/GoalDetails'

// Analytics
import Analytics from '../pages/analytics/Analytics'
import SpendingAnalysis from '../pages/analytics/SpendingAnalysis'
import BudgetRecommendations from '../pages/analytics/BudgetRecommendations'
import InvestmentInsights from '../pages/analytics/InvestmentInsights'
import FinancialHealth from '../pages/analytics/FinancialHealth'

// Reports
import Reports from '../pages/reports/Reports'
import FinancialReport from '../pages/reports/FinancialReport'
import ExpenseReport from '../pages/reports/ExpenseReport'
import InvestmentReport from '../pages/reports/InvestmentReport'
import GoalReport from '../pages/reports/GoalReport'

// Notifications
import Notifications from '../pages/notifications/Notifications'

// Profile
import Profile from '../pages/profile/Profile'
import Preferences from '../pages/profile/Preferences'
import Security from '../pages/profile/Security'

// Landing Page
import LandingPage from '../pages/LandingPage'

// 404
import NotFound from '../pages/NotFound'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Expenses Routes */}
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/expenses/history" element={<ExpenseHistory />} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />

        {/* Budgets Routes */}
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/budgets/create" element={<CreateBudget />} />
        <Route path="/budgets/edit/:id" element={<EditBudget />} />
        <Route path="/budgets/:id" element={<BudgetDetails />} />

        {/* Investments Routes */}
        <Route path="/investments" element={<Investments />} />
        <Route path="/investments/portfolio" element={<Portfolio />} />
        <Route path="/investments/add" element={<AddInvestment />} />
        <Route path="/investments/allocation" element={<AssetAllocation />} />
        <Route path="/investments/:id" element={<InvestmentDetails />} />

        {/* Goals Routes */}
        <Route path="/goals" element={<Goals />} />
        <Route path="/goals/create" element={<CreateGoal />} />
        <Route path="/goals/edit/:id" element={<EditGoal />} />
        <Route path="/goals/:id" element={<GoalDetails />} />

        {/* Analytics Routes */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/spending" element={<SpendingAnalysis />} />
        <Route path="/analytics/budget" element={<BudgetRecommendations />} />
        <Route path="/analytics/investments" element={<InvestmentInsights />} />
        <Route path="/analytics/financial-health" element={<FinancialHealth />} />

        {/* Reports Routes */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/financial" element={<FinancialReport />} />
        <Route path="/reports/expenses" element={<ExpenseReport />} />
        <Route path="/reports/investments" element={<InvestmentReport />} />
        <Route path="/reports/goals" element={<GoalReport />} />

        {/* Notifications */}
        <Route path="/notifications" element={<Notifications />} />

        {/* Profile */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/preferences" element={<Preferences />} />
        <Route path="/profile/security" element={<Security />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
