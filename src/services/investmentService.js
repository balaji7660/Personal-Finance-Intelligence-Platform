import apiClient from './api'

const STORAGE_KEY = 'finsight_investments'

const getStoredInvestments = () => {
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

const saveStoredInvestments = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export const investmentService = {
  getInvestments: async () => {
    try {
      const res = await apiClient.get('/investments')
      if (res.data && res.data.data) {
        saveStoredInvestments(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local investments:', err.message)
    }
    return getStoredInvestments()
  },

  getInvestmentById: async (id) => {
    try {
      const res = await apiClient.get(`/investments/${id}`)
      if (res.data && res.data.data) {
        return res.data.data
      }
    } catch (err) {
      console.warn('Backend API unavailable, using local lookup:', err.message)
    }
    const list = getStoredInvestments()
    const found = list.find((i) => String(i.id) === String(id))
    if (!found) throw new Error('Investment not found')
    return found
  },

  createInvestment: async (invData) => {
    try {
      const payload = {
        name: invData.name,
        type: invData.type,
        investedAmount: Number(invData.investedAmount),
        currentValue: Number(invData.currentValue || invData.investedAmount),
        purchaseDate: invData.purchaseDate || new Date().toISOString().split('T')[0],
        quantity: Number(invData.quantity || 1),
        riskLevel: invData.riskLevel || 'Moderate',
        notes: invData.notes || ''
      }
      const res = await apiClient.post('/investments', payload)
      if (res.data && res.data.data) {
        const created = res.data.data
        const list = getStoredInvestments()
        saveStoredInvestments([created, ...list])
        return created
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving investment locally:', err.message)
    }

    const list = getStoredInvestments()
    const newInv = {
      ...invData,
      id: 'inv_' + Date.now(),
      investedAmount: Number(invData.investedAmount),
      currentValue: Number(invData.currentValue || invData.investedAmount),
    }
    const updated = [newInv, ...list]
    saveStoredInvestments(updated)
    return newInv
  },

  updateInvestment: async (id, updatedData) => {
    try {
      const payload = {
        name: updatedData.name,
        type: updatedData.type,
        investedAmount: Number(updatedData.investedAmount),
        currentValue: Number(updatedData.currentValue),
        purchaseDate: updatedData.purchaseDate,
        quantity: Number(updatedData.quantity),
        riskLevel: updatedData.riskLevel,
        notes: updatedData.notes || ''
      }
      const res = await apiClient.put(`/investments/${id}`, payload)
      if (res.data && res.data.data) {
        const updatedItem = res.data.data
        const list = getStoredInvestments()
        const index = list.findIndex((i) => String(i.id) === String(id))
        if (index !== -1) {
          list[index] = updatedItem
          saveStoredInvestments(list)
        }
        return updatedItem
      }
    } catch (err) {
      console.warn('Backend API unavailable, updating investment locally:', err.message)
    }

    const list = getStoredInvestments()
    const index = list.findIndex((i) => String(i.id) === String(id))
    if (index === -1) throw new Error('Investment not found')
    const updatedInv = {
      ...list[index],
      ...updatedData,
      investedAmount: Number(updatedData.investedAmount !== undefined ? updatedData.investedAmount : list[index].investedAmount),
      currentValue: Number(updatedData.currentValue !== undefined ? updatedData.currentValue : list[index].currentValue),
    }
    list[index] = updatedInv
    saveStoredInvestments(list)
    return updatedInv
  },

  deleteInvestment: async (id) => {
    try {
      await apiClient.delete(`/investments/${id}`)
    } catch (err) {
      console.warn('Backend API unavailable, deleting investment locally:', err.message)
    }
    const list = getStoredInvestments()
    const filtered = list.filter((i) => String(i.id) !== String(id))
    saveStoredInvestments(filtered)
    return { success: true, id }
  },
}

export default investmentService
