import apiClient from './api'
import { initialUserData } from '../data/mockData'

export const userService = {
  getProfile: async () => {
    try {
      const res = await apiClient.get('/users/profile')
      if (res.data && res.data.data) {
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, returning cached profile:', err.message)
    }
    const saved = localStorage.getItem('finsight_user')
    return saved ? JSON.parse(saved) : initialUserData
  },

  updateProfile: async (updatedData) => {
    try {
      const res = await apiClient.put('/users/profile', updatedData)
      if (res.data && res.data.data) {
        localStorage.setItem('finsight_user', JSON.stringify(res.data.data))
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating profile locally:', err.message)
    }
    const current = localStorage.getItem('finsight_user')
    const user = current ? JSON.parse(current) : initialUserData
    const newProfile = { ...user, ...updatedData }
    localStorage.setItem('finsight_user', JSON.stringify(newProfile))
    return newProfile
  }
}

export default userService
