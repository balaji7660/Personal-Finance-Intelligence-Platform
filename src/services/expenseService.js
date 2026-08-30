import apiClient from './api'

const STORAGE_KEY = 'finsight_expenses'

const getStoredExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return []
    }
  }
  return []
}

const saveStoredExpenses = (expenses) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

export const expenseService = {
  getExpenses: async () => {
    try {
      const res = await apiClient.get('/expenses')
      if (res.data && res.data.data) {
        saveStoredExpenses(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local data for expenses:', err.message)
    }
    return getStoredExpenses()
  },

  getExpenseById: async (id) => {
    try {
      const res = await apiClient.get(`/expenses/${id}`)
      if (res.data && res.data.data) {
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local lookup:', err.message)
    }
    const expenses = getStoredExpenses()
    const found = expenses.find((e) => String(e.id) === String(id))
    if (!found) throw new Error('Expense not found')
    return found
  },

  createExpense: async (expenseData) => {
    try {
      const payload = {
        amount: Number(expenseData.amount),
        date: expenseData.date,
        category: expenseData.category,
        paymentMethod: expenseData.paymentMethod,
        description: expenseData.description,
        notes: expenseData.notes || '',
        status: expenseData.status || 'Completed'
      }
      const res = await apiClient.post('/expenses', payload)
      if (res.data && res.data.data) {
        const created = res.data.data
        const expenses = getStoredExpenses()
        saveStoredExpenses([created, ...expenses])
        return created
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving expense locally:', err.message)
    }

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
    try {
      const payload = {
        amount: Number(updatedData.amount),
        date: updatedData.date,
        category: updatedData.category,
        paymentMethod: updatedData.paymentMethod,
        description: updatedData.description,
        notes: updatedData.notes || '',
        status: updatedData.status || 'Completed'
      }
      const res = await apiClient.put(`/expenses/${id}`, payload)
      if (res.data && res.data.data) {
        const updatedItem = res.data.data
        const expenses = getStoredExpenses()
        const index = expenses.findIndex((e) => String(e.id) === String(id))
        if (index !== -1) {
          expenses[index] = updatedItem
          saveStoredExpenses(expenses)
        }
        return updatedItem
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating expense locally:', err.message)
    }

    const expenses = getStoredExpenses()
    const index = expenses.findIndex((e) => String(e.id) === String(id))
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
    try {
      await apiClient.delete(`/expenses/${id}`)
    } catch (err) {
      console.warn('Backend API unavailable, deleting expense locally:', err.message)
    }
    const expenses = getStoredExpenses()
    const filtered = expenses.filter((e) => String(e.id) !== String(id))
    saveStoredExpenses(filtered)
    return { success: true, id }
  },
}

export default expenseService
