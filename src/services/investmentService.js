import apiClient from './api'
import { initialInvestments } from '../data/mockData'

const STORAGE_KEY = 'finsight_investments'

const getStoredInvestments = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return initialInvestments
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInvestments))
  return initialInvestments
}

const saveStoredInvestments = (investments) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
}

export const investmentService = {
  getInvestments: async () => {
    // Backend: const res = await apiClient.get('/investments'); return res.data;
    return getStoredInvestments()
  },

  getInvestmentById: async (id) => {
    // Backend: const res = await apiClient.get(`/investments/${id}`); return res.data;
    const investments = getStoredInvestments()
    const found = investments.find((i) => i.id === id)
    if (!found) throw new Error('Investment not found')
    return found
  },

  createInvestment: async (investmentData) => {
    // Backend: const res = await apiClient.post('/investments', investmentData); return res.data;
    const investments = getStoredInvestments()
    const investedAmount = Number(investmentData.investedAmount)
    const currentValue = Number(investmentData.currentValue || investedAmount)
    const newInvestment = {
      ...investmentData,
      id: 'inv_' + Date.now(),
      investedAmount,
      currentValue,
      quantity: Number(investmentData.quantity || 1),
    }
    const updated = [newInvestment, ...investments]
    saveStoredInvestments(updated)
    return newInvestment
  },

  updateInvestment: async (id, updatedData) => {
    // Backend: const res = await apiClient.put(`/investments/${id}`, updatedData); return res.data;
    const investments = getStoredInvestments()
    const index = investments.findIndex((i) => i.id === id)
    if (index === -1) throw new Error('Investment not found')
    const updatedInvestment = {
      ...investments[index],
      ...updatedData,
      investedAmount: Number(updatedData.investedAmount !== undefined ? updatedData.investedAmount : investments[index].investedAmount),
      currentValue: Number(updatedData.currentValue !== undefined ? updatedData.currentValue : investments[index].currentValue),
      quantity: Number(updatedData.quantity !== undefined ? updatedData.quantity : investments[index].quantity),
    }
    investments[index] = updatedInvestment
    saveStoredInvestments(investments)
    return updatedInvestment
  },

  deleteInvestment: async (id) => {
    // Backend: const res = await apiClient.delete(`/investments/${id}`); return res.data;
    const investments = getStoredInvestments()
    const filtered = investments.filter((i) => i.id !== id)
    saveStoredInvestments(filtered)
    return { success: true, id }
  },
}

export default investmentService
