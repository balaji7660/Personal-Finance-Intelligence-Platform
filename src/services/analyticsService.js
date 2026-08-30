import apiClient from './api'

export const analyticsService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/dashboard')
      return response.data.data
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error)
      return null
    }
  },

  getSpendingAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/spending')
      return response.data.data
    } catch (error) {
      console.error('Error fetching spending analytics:', error)
      return null
    }
  },

  getBudgetAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/budget')
      return response.data.data
    } catch (error) {
      console.error('Error fetching budget analytics:', error)
      return null
    }
  },

  getInvestmentAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/investments')
      return response.data.data
    } catch (error) {
      console.error('Error fetching investment analytics:', error)
      return null
    }
  },

  getFinancialHealth: async () => {
    try {
      const response = await apiClient.get('/analytics/financial-health')
      return response.data.data
    } catch (error) {
      console.error('Error fetching financial health analytics:', error)
      return null
    }
  },
}
