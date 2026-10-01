import apiClient from './api'
import { initialUserData } from '../data/mockData'

const STORAGE_KEY = 'finsight_user'

const getStoredUser = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialUserData
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialUserData))
  return initialUserData
}

const saveStoredUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const userService = {
  getProfile: async () => {
    // Backend: const res = await apiClient.get('/users/profile'); return res.data;
    return getStoredUser()
  },

  updateProfile: async (updatedData) => {
    // Backend: const res = await apiClient.put('/users/profile', updatedData); return res.data;
    const current = getStoredUser()
    const updated = { ...current, ...updatedData }
    saveStoredUser(updated)
    return updated
  },

  updatePreferences: async (preferences) => {
    // Backend: const res = await apiClient.put('/users/preferences', preferences); return res.data;
    const current = getStoredUser()
    const updated = { ...current, preferences: { ...(current.preferences || {}), ...preferences } }
    saveStoredUser(updated)
    return updated
  },

  changePassword: async (passwords) => {
    // Backend: const res = await apiClient.post('/users/change-password', passwords); return res.data;
    return { success: true, message: 'Password updated successfully' }
  },
}

export default userService
