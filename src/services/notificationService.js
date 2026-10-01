import apiClient from './api'
import { initialNotifications } from '../data/mockData'

const STORAGE_KEY = 'finsight_notifications'

const getStoredNotifications = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialNotifications
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotifications))
  return initialNotifications
}

const saveStoredNotifications = (notifications) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
}

export const notificationService = {
  getNotifications: async () => {
    // Backend: const res = await apiClient.get('/notifications'); return res.data;
    return getStoredNotifications()
  },

  markAsRead: async (id) => {
    // Backend: const res = await apiClient.patch(`/notifications/${id}/read`); return res.data;
    const notifications = getStoredNotifications()
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    saveStoredNotifications(updated)
    return updated
  },

  markAllAsRead: async () => {
    // Backend: const res = await apiClient.patch('/notifications/mark-all-read'); return res.data;
    const notifications = getStoredNotifications()
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveStoredNotifications(updated)
    return updated
  },

  deleteNotification: async (id) => {
    // Backend: const res = await apiClient.delete(`/notifications/${id}`); return res.data;
    const notifications = getStoredNotifications()
    const filtered = notifications.filter((n) => n.id !== id)
    saveStoredNotifications(filtered)
    return { success: true, id }
  },

  addNotification: async (notifData) => {
    const notifications = getStoredNotifications()
    const newNotif = {
      ...notifData,
      id: 'notif_' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false,
    }
    const updated = [newNotif, ...notifications]
    saveStoredNotifications(updated)
    return newNotif
  }
}

export default notificationService
