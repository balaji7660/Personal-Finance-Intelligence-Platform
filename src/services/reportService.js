import apiClient from './api'
import { expenseService } from './expenseService'
import { budgetService } from './budgetService'
import { investmentService } from './investmentService'
import { goalService } from './goalService'
import { analyticsData } from '../data/mockData'

export const reportService = {
  getFinancialSummary: async (timeframe = 'monthly') => {
    // Backend: const res = await apiClient.get(`/reports/financial?timeframe=${timeframe}`); return res.data;
    const expenses = await expenseService.getExpenses()
    const budgets = await budgetService.getBudgets()
    const investments = await investmentService.getInvestments()
    const goals = await goalService.getGoals()

    const totalIncome = 75000
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    const totalInvested = investments.reduce((acc, curr) => acc + Number(curr.investedAmount || 0), 0)
    const currentInvestmentValue = investments.reduce((acc, curr) => acc + Number(curr.currentValue || 0), 0)
    const totalSavings = Math.max(0, totalIncome - totalExpenses)
    const netWorth = currentInvestmentValue + totalSavings + 150000 // bank balance

    return {
      totalIncome,
      totalExpenses,
      totalSavings,
      totalInvested,
      currentInvestmentValue,
      netWorth,
      monthlyTrends: analyticsData.monthlyComparison,
      categoryDistribution: analyticsData.categorySpending,
    }
  },

  getExpenseReport: async (filter = {}) => {
    const expenses = await expenseService.getExpenses()
    return {
      expenses,
      total: expenses.reduce((acc, curr) => acc + Number(curr.amount), 0),
      count: expenses.length,
      categorySummary: analyticsData.categorySpending,
    }
  },

  getInvestmentReport: async () => {
    const investments = await investmentService.getInvestments()
    const totalInvested = investments.reduce((acc, curr) => acc + Number(curr.investedAmount), 0)
    const totalCurrent = investments.reduce((acc, curr) => acc + Number(curr.currentValue), 0)
    const totalReturns = totalCurrent - totalInvested
    const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

    return {
      investments,
      totalInvested,
      totalCurrent,
      totalReturns,
      returnPercentage,
    }
  },

  getGoalReport: async () => {
    const goals = await goalService.getGoals()
    const totalTarget = goals.reduce((acc, curr) => acc + Number(curr.targetAmount), 0)
    const totalSaved = goals.reduce((acc, curr) => acc + Number(curr.savedAmount), 0)
    const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length

    return {
      goals,
      totalGoals: goals.length,
      completedGoals,
      activeGoals: goals.length - completedGoals,
      totalTarget,
      totalSaved,
      overallProgress: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
    }
  },
}

export default reportService
