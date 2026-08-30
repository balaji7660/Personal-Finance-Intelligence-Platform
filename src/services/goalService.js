import apiClient from './api'

const STORAGE_KEY = 'finsight_goals'

const getStoredGoals = () => {
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

const saveStoredGoals = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const goalService = {
  getGoals: async () => {
    try {
      const res = await apiClient.get('/goals')
      if (res.data && res.data.data) {
        saveStoredGoals(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local goals:', err.message)
    }
    return getStoredGoals()
  },

  getGoalById: async (id) => {
    try {
      const res = await apiClient.get(`/goals/${id}`)
      if (res.data && res.data.data) {
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local lookup:', err.message)
    }
    const list = getStoredGoals()
    const found = list.find((g) => String(g.id) === String(id))
    if (!found) throw new Error('Goal not found')
    return found
  },

  createGoal: async (goalData) => {
    try {
      const payload = {
        name: goalData.name,
        type: goalData.type,
        targetAmount: Number(goalData.targetAmount),
        savedAmount: Number(goalData.savedAmount || 0),
        targetDate: goalData.targetDate,
        priority: goalData.priority || 'High',
        notes: goalData.notes || ''
      }
      const res = await apiClient.post('/goals', payload)
      if (res.data && res.data.data) {
        const created = res.data.data
        const list = getStoredGoals()
        saveStoredGoals([created, ...list])
        return created
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving goal locally:', err.message)
    }

    const list = getStoredGoals()
    const newGoal = {
      ...goalData,
      id: 'gol_' + Date.now(),
      targetAmount: Number(goalData.targetAmount),
      savedAmount: Number(goalData.savedAmount || 0),
    }
    const updated = [newGoal, ...list]
    saveStoredGoals(updated)
    return newGoal
  },

  updateGoal: async (id, updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        type: updatedData.type,
        targetAmount: Number(updatedData.targetAmount),
        savedAmount: Number(updatedData.savedAmount || 0),
        targetDate: updatedData.targetDate,
        priority: updatedData.priority,
        notes: updatedData.notes || ''
      }
      const res = await apiClient.put(`/goals/${id}`, payload)
      if (res.data && res.data.data) {
        const updatedItem = res.data.data
        const list = getStoredGoals()
        const index = list.findIndex((g) => String(g.id) === String(id))
        if (index !== -1) {
          list[index] = updatedItem
          saveStoredGoals(list)
        }
        return updatedItem
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating goal locally:', err.message)
    }

    const list = getStoredGoals()
    const index = list.findIndex((g) => String(g.id) === String(id))
    if (index === -1) throw new Error('Goal not found')
    const updatedGoal = {
      ...list[index],
      ...updatedData,
      targetAmount: Number(updatedData.targetAmount !== undefined ? updatedData.targetAmount : list[index].targetAmount),
      savedAmount: Number(updatedData.savedAmount !== undefined ? updatedData.savedAmount : list[index].savedAmount),
    }
    list[index] = updatedGoal
    saveStoredGoals(list)
    return updatedGoal
  },

  deleteGoal: async (id) => {
    try {
      await apiClient.delete(`/goals/${id}`)
    } catch (err) {
      console.warn('Backend API unavailable, deleting goal locally:', err.message)
    }
    const list = getStoredGoals()
    const filtered = list.filter((g) => String(g.id) !== String(id))
    saveStoredGoals(filtered)
    return { success: true, id }
  },
}

export default goalService
