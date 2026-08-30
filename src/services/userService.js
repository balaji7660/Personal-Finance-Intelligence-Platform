import apiClient from './api'

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
    return saved ? JSON.parse(saved) : null
  },

  updateProfile: async (updatedData) => {
    try {
      const res = await apiClient.put('/users/profile', updatedData)
      if (res.data && res.data.data) {
        const user = res.data.data
        localStorage.setItem('finsight_user', JSON.stringify(user))
        const profiles = JSON.parse(localStorage.getItem('finsight_saved_profiles') || '{}')
        if (user.email) {
          profiles[user.email.toLowerCase()] = user
          localStorage.setItem('finsight_saved_profiles', JSON.stringify(profiles))
        }
        return user
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating profile locally:', err.message)
    }
    const current = localStorage.getItem('finsight_user')
    const user = current ? JSON.parse(current) : {}
    const newProfile = { ...user, ...updatedData }
    localStorage.setItem('finsight_user', JSON.stringify(newProfile))
    
    const profiles = JSON.parse(localStorage.getItem('finsight_saved_profiles') || '{}')
    if (newProfile.email) {
      profiles[newProfile.email.toLowerCase()] = newProfile
      localStorage.setItem('finsight_saved_profiles', JSON.stringify(profiles))
    }
    return newProfile
  }
}

export default userService
