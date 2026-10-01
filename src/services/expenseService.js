import apiClient from './api'
import { initialExpenses } from '../data/mockData'

const STORAGE_KEY = 'finsight_expenses'

const getStoredExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialExpenses
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialExpenses))
  return initialExpenses
}

const saveStoredExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export const expenseService = {
  getExpenses: async () => {
    // Backend: const res = await apiClient.get('/expenses'); return res.data;
    return getStoredExpenses()
  },

  getExpenseById: async (id) => {
    // Backend: const res = await apiClient.get(`/expenses/${id}`); return res.data;
    const expenses = getStoredExpenses()
    const found = expenses.find((e) => e.id === id)
    if (!found) throw new Error('Expense not found')
    return found
  },

  createExpense: async (expenseData) => {
    // Backend: const res = await apiClient.post('/expenses', expenseData); return res.data;
    const expenses = getStoredExpenses()
    const newExpense = {
      ...expenseData,
      id: 'exp_' + Date.now(),
      amount: Number(expenseData.amount),
      status: expenseData.status || 'Completed',
    }
    const updated = [newExpense, ...expenses]
    saveStoredExpenses(updated)
    return newExpense
  },

  updateExpense: async (id, updatedData) => {
    // Backend: const res = await apiClient.put(`/expenses/${id}`, updatedData); return res.data;
    const expenses = getStoredExpenses()
    const index = expenses.findIndex((e) => e.id === id)
    if (index === -1) throw new Error('Expense not found')
    const updatedExpense = {
      ...expenses[index],
      ...updatedData,
      amount: Number(updatedData.amount !== undefined ? updatedData.amount : expenses[index].amount),
    }
    expenses[index] = updatedExpense
    saveStoredExpenses(expenses)
    return updatedExpense
  },

  deleteExpense: async (id) => {
    // Backend: const res = await apiClient.delete(`/expenses/${id}`); return res.data;
    const expenses = getStoredExpenses()
    const filtered = expenses.filter((e) => e.id !== id)
    saveStoredExpenses(filtered)
    return { success: true, id }
  },
}

export default expenseService
