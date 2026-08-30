import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { expenseService } from '../services/expenseService'
import { budgetService } from '../services/budgetService'
import { investmentService } from '../services/investmentService'
import { goalService } from '../services/goalService'
import { notificationService } from '../services/notificationService'
import { useAuth } from '../hooks/useAuth'

const FinanceContext = createContext(null)

export const FinanceProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState([])
  const [investments, setInvestments] = useState([])
  const [goals, setGoals] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }, [])

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const [expData, budData, invData, golData, notifData] = await Promise.all([
        expenseService.getExpenses(),
        budgetService.getBudgets(),
        investmentService.getInvestments(),
        goalService.getGoals(),
        notificationService.getNotifications(),
      ])
      setExpenses(expData)
      setBudgets(budData)
      setInvestments(invData)
      setGoals(golData)
      setNotifications(notifData)
    } catch (error) {
      console.error('Error loading finance data:', error)
      showToast('Failed to load finance data', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (isAuthenticated) {
      refreshData()
    }
  }, [isAuthenticated, refreshData])

  // Expense Actions
  const addExpense = async (expenseData) => {
    const newExpense = await expenseService.createExpense(expenseData)
    setExpenses((prev) => [newExpense, ...prev])
    
    // Automatically update budget spent if matching category exists
    const matchingBudget = budgets.find((b) => b.category === expenseData.category)
    if (matchingBudget) {
      const updatedSpent = matchingBudget.spent + Number(expenseData.amount)
      await updateBudget(matchingBudget.id, { spent: updatedSpent })
    }

    showToast('Expense added successfully!')
    return newExpense
  }

  const updateExpense = async (id, updatedData) => {
    const updated = await expenseService.updateExpense(id, updatedData)
    setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)))
    showToast('Expense updated successfully!')
    return updated
  }

  const deleteExpense = async (id) => {
    await expenseService.deleteExpense(id)
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    showToast('Expense deleted successfully!')
  }

  // Budget Actions
  const addBudget = async (budgetData) => {
    const newBudget = await budgetService.createBudget(budgetData)
    setBudgets((prev) => [newBudget, ...prev])
    showToast('Budget created successfully!')
    return newBudget
  }

  const updateBudget = async (id, updatedData) => {
    const updated = await budgetService.updateBudget(id, updatedData)
    setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)))
    showToast('Budget updated successfully!')
    return updated
  }

  const deleteBudget = async (id) => {
    await budgetService.deleteBudget(id)
    setBudgets((prev) => prev.filter((b) => b.id !== id))
    showToast('Budget deleted successfully!')
  }

  // Investment Actions
  const addInvestment = async (invData) => {
    const newInv = await investmentService.createInvestment(invData)
    setInvestments((prev) => [newInv, ...prev])
    showToast('Investment added successfully!')
    return newInv
  }

  const updateInvestment = async (id, updatedData) => {
    const updated = await investmentService.updateInvestment(id, updatedData)
    setInvestments((prev) => prev.map((i) => (i.id === id ? updated : i)))
    showToast('Investment updated successfully!')
    return updated
  }

  const deleteInvestment = async (id) => {
    await investmentService.deleteInvestment(id)
    setInvestments((prev) => prev.filter((i) => i.id !== id))
    showToast('Investment removed successfully!')
  }

  // Goal Actions
  const addGoal = async (goalData) => {
    const newGoal = await goalService.createGoal(goalData)
    setGoals((prev) => [newGoal, ...prev])
    showToast('Goal created successfully!')
    return newGoal
  }

  const updateGoal = async (id, updatedData) => {
    const updated = await goalService.updateGoal(id, updatedData)
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
    showToast('Goal updated successfully!')
    return updated
  }

  const deleteGoal = async (id) => {
    await goalService.deleteGoal(id)
    setGoals((prev) => prev.filter((g) => g.id !== id))
    showToast('Goal removed successfully!')
  }

  // Notification Actions
  const markNotificationAsRead = async (id) => {
    const updated = await notificationService.markAsRead(id)
    setNotifications(updated)
  }

  const markAllNotificationsAsRead = async () => {
    const updated = await notificationService.markAllAsRead()
    setNotifications(updated)
    showToast('All notifications marked as read')
  }

  const deleteNotification = async (id) => {
    await notificationService.deleteNotification(id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Auth destructured at the top of the provider

  // Computed Financial Totals
  const totalIncome = user?.monthlyIncome ? Number(user.monthlyIncome) : 75000 // dynamic user monthly income
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const totalSavings = Math.max(0, totalIncome - totalExpenses)
  const totalBudgetLimit = budgets.reduce((acc, curr) => acc + Number(curr.limit || 0), 0)
  const totalBudgetSpent = budgets.reduce((acc, curr) => acc + Number(curr.spent || 0), 0)
  const budgetUtilization = totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0

  // Compute live health score
  const hasExpenses = expenses.length > 0
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0
  const savingsScore = hasExpenses ? Math.min(100, Math.round((savingsRate / 20) * 80)) : null
  const budgetsWithinLimit = budgets.filter(b => Number(b.spent || 0) <= Number(b.limit || 0)).length
  const budgetHealthScore = hasExpenses && budgets.length > 0
    ? Math.round((budgetsWithinLimit / budgets.length) * 100)
    : null
  const totalInvested = investments.reduce((acc, curr) => acc + Number(curr.investedAmount || 0), 0)
  const currentInvestmentValue = investments.reduce((acc, curr) => acc + Number(curr.currentValue || 0), 0)
  const gainPct = totalInvested > 0 ? ((currentInvestmentValue - totalInvested) / totalInvested) * 100 : 0
  const investScore = investments.length > 0 ? Math.min(100, Math.round(50 + gainPct * 2)) : null
  const debtScore = 70
  const activePillars = [savingsScore, budgetHealthScore, investScore, debtScore].filter(s => s !== null)
  const healthScore = activePillars.length > 1
    ? Math.round(activePillars.reduce((a, b) => a + b, 0) / activePillars.length)
    : 0

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        budgets,
        investments,
        goals,
        notifications,
        loading,
        toastMessage,
        showToast,
        refreshData,
        // Actions
        addExpense,
        updateExpense,
        deleteExpense,
        addBudget,
        updateBudget,
        deleteBudget,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        addGoal,
        updateGoal,
        deleteGoal,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        // Computed metrics
        metrics: {
          totalIncome,
          totalExpenses,
          totalSavings,
          totalInvested,
          currentInvestmentValue,
          totalBudgetLimit,
          totalBudgetSpent,
          budgetUtilization,
          healthScore,
        }
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
