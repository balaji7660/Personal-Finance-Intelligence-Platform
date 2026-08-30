import apiClient from './api'
import { analyticsData } from '../data/mockData'

export const reportService = {
  getFinancialReport: async () => {
    try {
      const res = await apiClient.get('/reports/financial')
      if (res.data && res.data.data) {
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, compiling client report:', err.message)
    }

    return {
      reportType: 'Financial Statement Summary',
      period: 'August 2026',
      totalIncome: 75000,
      totalExpenses: 42500,
      totalSavings: 32500,
      netWorth: 277500,
      totalInvested: 315000,
      currentPortfolioValue: 374000,
      totalReturns: 59000,
      portfolioReturnPercentage: 18.7,
      totalGoals: 5,
      completedGoals: 1,
      activeGoals: 4
    }
  },

  getExpenseReport: async () => {
    return {
      categorySpending: analyticsData.categorySpending,
      highestCategory: 'Food',
      highestCategoryAmount: 9850,
      averageDaily: 1416
    }
  },

  getInvestmentReport: async () => {
    return {
      totalInvested: 315000,
      currentValue: 374000,
      returns: 59000,
      returnPercentage: 18.7,
      bestAsset: 'Parag Parikh Flexi Cap Fund (+29.0%)'
    }
  },

  getGoalReport: async () => {
    return {
      totalGoals: 5,
      completed: 1,
      inProgress: 4,
      overallProgressPercentage: 62.4
    }
  }
}

export default reportService
