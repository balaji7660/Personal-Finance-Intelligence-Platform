import apiClient from './api'

const STORAGE_KEY = 'finsight_budgets'

const getStoredBudgets = () => {
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

const saveStoredBudgets = (budgets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
}

export const budgetService = {
  getBudgets: async () => {
    try {
      const res = await apiClient.get('/budgets')
      if (res.data && res.data.data) {
        const normalized = res.data.data.map(b => ({
          ...b,
          limit: Number(b.monthlyLimit)
        }))
        saveStoredBudgets(normalized)
        return normalized
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local budgets:', err.message)
    }
    return getStoredBudgets()
  },

  getBudgetById: async (id) => {
    try {
      const res = await apiClient.get(`/budgets/${id}`)
      if (res.data && res.data.data) {
        const b = res.data.data
        return {
          ...b,
          limit: Number(b.monthlyLimit)
        }
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local lookup:', err.message)
    }
    const budgets = getStoredBudgets()
    const found = budgets.find((b) => String(b.id) === String(id))
    if (!found) throw new Error('Budget not found')
    return found
  },

  createBudget: async (budgetData) => {
    try {
      const payload = {
        name: budgetData.name,
        category: budgetData.category,
        monthlyLimit: Number(budgetData.limit || budgetData.monthlyLimit),
        spent: Number(budgetData.spent || 0),
        startDate: budgetData.startDate || new Date().toISOString().split('T')[0],
        endDate: budgetData.endDate || null
      }
      const res = await apiClient.post('/budgets', payload)
      if (res.data && res.data.data) {
        const created = {
          ...res.data.data,
          limit: Number(res.data.data.monthlyLimit)
        }
        const list = getStoredBudgets()
        saveStoredBudgets([created, ...list])
        return created
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving budget locally:', err.message)
    }

    const list = getStoredBudgets()
    const newBudget = {
      ...budgetData,
      id: 'bud_' + Date.now(),
      limit: Number(budgetData.limit),
      spent: Number(budgetData.spent || 0),
    }
    const updated = [newBudget, ...list]
    saveStoredBudgets(updated)
    return newBudget
  },

  updateBudget: async (id, updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        category: updatedData.category,
        monthlyLimit: Number(updatedData.limit !== undefined ? updatedData.limit : updatedData.monthlyLimit),
        spent: Number(updatedData.spent || 0),
        startDate: updatedData.startDate,
        endDate: updatedData.endDate
      }
      const res = await apiClient.put(`/budgets/${id}`, payload)
      if (res.data && res.data.data) {
        const updatedItem = {
          ...res.data.data,
          limit: Number(res.data.data.monthlyLimit)
        }
        const list = getStoredBudgets()
        const index = list.findIndex((b) => String(b.id) === String(id))
        if (index !== -1) {
          list[index] = updatedItem
          saveStoredBudgets(list)
        }
        return updatedItem
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating budget locally:', err.message)
    }

    const list = getStoredBudgets()
    const index = list.findIndex((b) => String(b.id) === String(id))
    if (index === -1) throw new Error('Budget not found')
    const updatedBudget = {
      ...list[index],
      ...updatedData,
      limit: Number(updatedData.limit !== undefined ? updatedData.limit : list[index].limit),
      spent: Number(updatedData.spent !== undefined ? updatedData.spent : list[index].spent),
    }
    list[index] = updatedBudget
    saveStoredBudgets(list)
    return updatedBudget
  },

  deleteBudget: async (id) => {
    try {
      await apiClient.delete(`/budgets/${id}`)
    } catch (err) {
      console.warn('Backend API unavailable, deleting budget locally:', err.message)
    }
    const list = getStoredBudgets()
    const filtered = list.filter((b) => String(b.id) !== String(id))
    saveStoredBudgets(filtered)
    return { success: true, id }
  },
}

export default budgetService
