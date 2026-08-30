import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

const AuthContext = createContext(null)

export const clearFinancialStorage = () => {
  localStorage.removeItem('finsight_expenses')
  localStorage.removeItem('finsight_budgets')
  localStorage.removeItem('finsight_investments')
  localStorage.removeItem('finsight_goals')
  localStorage.removeItem('finsight_notifications')
}

// One-time purge: clears any stale mock data from older app versions
const STORAGE_VERSION = 'v2'
if (localStorage.getItem('finsight_storage_version') !== STORAGE_VERSION) {
  clearFinancialStorage()
  localStorage.setItem('finsight_storage_version', STORAGE_VERSION)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('finsight_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('finsight_token')
      const savedUser = localStorage.getItem('finsight_user')
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser))
          setToken(savedToken)
        } catch {
          setUser(null)
          setToken(null)
          localStorage.removeItem('finsight_token')
          localStorage.removeItem('finsight_user')
        }
      } else {
        setUser(null)
        setToken(null)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
      clearFinancialStorage()
      const response = await authService.login(credentials)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('finsight_token', response.token)
      localStorage.setItem('finsight_user', JSON.stringify(response.user))
      return response
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      clearFinancialStorage()
      const response = await authService.register(userData)
      return response
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    clearFinancialStorage()
    setUser(null)
    setToken(null)
    localStorage.removeItem('finsight_token')
    localStorage.removeItem('finsight_user')
  }

  const updateProfile = async (updatedData) => {
    const updated = await userService.updateProfile(updatedData)
    setUser(updated)
    localStorage.setItem('finsight_user', JSON.stringify(updated))
    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
