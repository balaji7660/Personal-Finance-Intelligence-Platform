import apiClient from './api'
import { initialBudgets } from '../data/mockData'

const STORAGE_KEY = 'finsight_budgets'

const getStoredBudgets = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialBudgets
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBudgets))
  return initialBudgets
}

const saveStoredBudgets = (budgets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
}

const categoryColors = {
  Food: '#f97316',
  Travel: '#06b6d4',
  Shopping: '#ec4899',
  Bills: '#eab308',
  Education: '#8b5cf6',
  Healthcare: '#10b981',
  Entertainment: '#6366f1',
  Other: '#64748b',
}

export const budgetService = {
  getBudgets: async () => {
    // Backend: const res = await apiClient.get('/budgets'); return res.data;
    return getStoredBudgets()
  },

  getBudgetById: async (id) => {
    // Backend: const res = await apiClient.get(`/budgets/${id}`); return res.data;
    const budgets = getStoredBudgets()
    const found = budgets.find((b) => b.id === id)
    if (!found) throw new Error('Budget not found')
    return found
  },

  createBudget: async (budgetData) => {
    // Backend: const res = await apiClient.post('/budgets', budgetData); return res.data;
    const budgets = getStoredBudgets()
    const newBudget = {
      ...budgetData,
      id: 'bud_' + Date.now(),
      limit: Number(budgetData.limit),
      spent: Number(budgetData.spent || 0),
      color: categoryColors[budgetData.category] || '#2b8aff',
    }
    const updated = [newBudget, ...budgets]
    saveStoredBudgets(updated)
    return newBudget
  },

  updateBudget: async (id, updatedData) => {
    // Backend: const res = await apiClient.put(`/budgets/${id}`, updatedData); return res.data;
    const budgets = getStoredBudgets()
    const index = budgets.findIndex((b) => b.id === id)
    if (index === -1) throw new Error('Budget not found')
    const updatedBudget = {
      ...budgets[index],
      ...updatedData,
      limit: Number(updatedData.limit !== undefined ? updatedData.limit : budgets[index].limit),
      spent: Number(updatedData.spent !== undefined ? updatedData.spent : budgets[index].spent),
      color: updatedData.category ? categoryColors[updatedData.category] || '#2b8aff' : budgets[index].color,
    }
    budgets[index] = updatedBudget
    saveStoredBudgets(budgets)
    return updatedBudget
  },

  deleteBudget: async (id) => {
    // Backend: const res = await apiClient.delete(`/budgets/${id}`); return res.data;
    const budgets = getStoredBudgets()
    const filtered = budgets.filter((b) => b.id !== id)
    saveStoredBudgets(filtered)
    return { success: true, id }
  },
}

export default budgetService
