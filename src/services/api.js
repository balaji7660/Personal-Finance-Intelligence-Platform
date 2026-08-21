import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.finsight.app/v1'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor for attaching auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finsight_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error / token expiration
      localStorage.removeItem('finsight_token')
      localStorage.removeItem('finsight_user')
    }
    return Promise.reject(error)
  }
)

export default apiClient
