import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { initialUserData } from '../data/mockData'

const AuthContext = createContext(null)

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
          setUser(initialUserData)
          setToken(savedToken)
        }
      } else {
        // Provide default guest session if token exists or start unauthenticated
        const demoAuth = localStorage.getItem('finsight_demo_autologin')
        if (demoAuth !== 'false') {
          // Pre-populate with initial user for immediate seamless demonstration
          setUser(initialUserData)
          setToken('mock_demo_token')
          localStorage.setItem('finsight_token', 'mock_demo_token')
          localStorage.setItem('finsight_user', JSON.stringify(initialUserData))
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    setLoading(true)
    try {
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
      const response = await authService.register(userData)
      setUser(response.user)
      setToken(response.token)
      localStorage.setItem('finsight_token', response.token)
      localStorage.setItem('finsight_user', JSON.stringify(response.user))
      return response
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setToken(null)
    localStorage.removeItem('finsight_token')
    localStorage.removeItem('finsight_user')
    localStorage.setItem('finsight_demo_autologin', 'false')
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
