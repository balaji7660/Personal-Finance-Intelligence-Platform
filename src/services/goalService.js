import apiClient from './api'
import { initialGoals } from '../data/mockData'

const STORAGE_KEY = 'finsight_goals'

const getStoredGoals = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialGoals
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGoals))
  return initialGoals
}

const saveStoredGoals = (goals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
}

export const goalService = {
  getGoals: async () => {
    // Backend: const res = await apiClient.get('/goals'); return res.data;
    return getStoredGoals()
  },

  getGoalById: async (id) => {
    // Backend: const res = await apiClient.get(`/goals/${id}`); return res.data;
    const goals = getStoredGoals()
    const found = goals.find((g) => g.id === id)
    if (!found) throw new Error('Goal not found')
    return found
  },

  createGoal: async (goalData) => {
    // Backend: const res = await apiClient.post('/goals', goalData); return res.data;
    const goals = getStoredGoals()
    const newGoal = {
      ...goalData,
      id: 'gol_' + Date.now(),
      targetAmount: Number(goalData.targetAmount),
      savedAmount: Number(goalData.savedAmount || 0),
      priority: goalData.priority || 'Medium',
    }
    const updated = [newGoal, ...goals]
    saveStoredGoals(updated)
    return newGoal
  },

  updateGoal: async (id, updatedData) => {
    // Backend: const res = await apiClient.put(`/goals/${id}`, updatedData); return res.data;
    const goals = getStoredGoals()
    const index = goals.findIndex((g) => g.id === id)
    if (index === -1) throw new Error('Goal not found')
    const updatedGoal = {
      ...goals[index],
      ...updatedData,
      targetAmount: Number(updatedData.targetAmount !== undefined ? updatedData.targetAmount : goals[index].targetAmount),
      savedAmount: Number(updatedData.savedAmount !== undefined ? updatedData.savedAmount : goals[index].savedAmount),
    }
    goals[index] = updatedGoal
    saveStoredGoals(goals)
    return updatedGoal
  },

  deleteGoal: async (id) => {
    // Backend: const res = await apiClient.delete(`/goals/${id}`); return res.data;
    const goals = getStoredGoals()
    const filtered = goals.filter((g) => g.id !== id)
    saveStoredGoals(filtered)
    return { success: true, id }
  },
}

export default goalService
