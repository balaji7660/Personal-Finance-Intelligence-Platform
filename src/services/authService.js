import apiClient from './api'
import { initialUserData } from '../data/mockData'

export const authService = {
  login: async (credentials) => {
    try {
      // In future backend integration: const res = await apiClient.post('/auth/login', credentials); return res.data;
      const { identifier, password } = credentials
      if (!identifier || !password) {
        throw new Error('Please provide email/mobile and password')
      }
      const token = 'mock_jwt_token_' + Date.now()
      const user = { ...initialUserData, email: identifier.includes('@') ? identifier : initialUserData.email }
      return { success: true, token, user }
    } catch (err) {
      throw err
    }
  },

  register: async (userData) => {
    try {
      // Backend: const res = await apiClient.post('/auth/register', userData); return res.data;
      const token = 'mock_jwt_token_' + Date.now()
      const newUser = {
        ...initialUserData,
        name: userData.fullName || userData.name || 'New User',
        email: userData.email,
        mobile: userData.mobile,
        monthlyIncome: Number(userData.monthlyIncome) || 50000,
        riskPreference: userData.riskPreference || 'Moderate',
        currency: userData.currency || 'INR (₹)',
      }
      return { success: true, token, user: newUser }
    } catch (err) {
      throw err
    }
  },

  forgotPassword: async (identifier) => {
    // Backend: const res = await apiClient.post('/auth/forgot-password', { identifier }); return res.data;
    return { success: true, message: `OTP sent successfully to ${identifier}` }
  },

  resetPassword: async (data) => {
    // Backend: const res = await apiClient.post('/auth/reset-password', data); return res.data;
    return { success: true, message: 'Password reset successfully' }
  },

  verifyOTP: async (otp) => {
    // Backend: const res = await apiClient.post('/auth/verify-otp', { otp }); return res.data;
    if (otp === '123456' || otp.length === 6) {
      return { success: true, message: 'OTP verified successfully' }
    }
    throw new Error('Invalid OTP. Use test code 123456.')
  },

  logout: async () => {
    // Backend: await apiClient.post('/auth/logout');
    localStorage.removeItem('finsight_token')
    localStorage.removeItem('finsight_user')
    return { success: true }
  }
}

export default authService
