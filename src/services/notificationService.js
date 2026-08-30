import apiClient from './api'

const STORAGE_KEY = 'finsight_notifications'

const getStoredNotifications = () => {
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

const saveStoredNotifications = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const notificationService = {
  getNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications')
      if (res.data && res.data.data) {
        saveStoredNotifications(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local notifications:', err.message)
    }
    return getStoredNotifications()
  },

  markAsRead: async (id) => {
    try {
      const res = await apiClient.put(`/notifications/${id}/read`)
      if (res.data && res.data.data) {
        const list = getStoredNotifications()
        const index = list.findIndex((n) => String(n.id) === String(id))
        if (index !== -1) {
          list[index].read = true
          saveStoredNotifications(list)
        }
        return list
      }
    } catch (err) {
      console.warn('Backend API unavailable, marking as read locally:', err.message)
    }

    const list = getStoredNotifications()
    const index = list.findIndex((n) => String(n.id) === String(id))
    if (index !== -1) {
      list[index].read = true
      saveStoredNotifications(list)
    }
    return list
  },

  markAllAsRead: async () => {
    try {
      const res = await apiClient.put('/notifications/read-all')
      if (res.data && res.data.data) {
        saveStoredNotifications(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, marking all read locally:', err.message)
    }

    const list = getStoredNotifications().map((n) => ({ ...n, read: true }))
    saveStoredNotifications(list)
    return list
  },

  deleteNotification: async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`)
    } catch (err) {
      console.warn('Backend API unavailable, deleting notification locally:', err.message)
    }

    const list = getStoredNotifications()
    const filtered = list.filter((n) => String(n.id) !== String(id))
    saveStoredNotifications(filtered)
    return { success: true, id }
  },
}

export default notificationService
