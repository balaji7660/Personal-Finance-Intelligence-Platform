import apiClient from './api'

// ── Mock fallback data used when backend is unavailable (e.g. Vercel deployment) ──

const MOCK_SPENDING = {
  highestCategoryName: 'Healthcare',
  highestCategoryAmount: 8250,
  highestCategoryPercentage: 19.4,
  monthlyAverage: 42500,
  discretionaryPct: 52,
  fixedPct: 48,
  ratioString: '52% / 48%',
  trendValue: '+4.9%',
  trendIsPositive: false,
  trendSubtitle: 'vs ₹40,500 in July',
  categorySpending: [
    { name: 'Food', value: 9850, color: '#f97316' },
    { name: 'Travel', value: 4400, color: '#06b6d4' },
    { name: 'Shopping', value: 7200, color: '#ec4899' },
    { name: 'Bills', value: 7700, color: '#eab308' },
    { name: 'Education', value: 2199, color: '#8b5cf6' },
    { name: 'Healthcare', value: 8250, color: '#10b981' },
    { name: 'Entertainment', value: 2649, color: '#6366f1' },
    { name: 'Other', value: 2000, color: '#64748b' },
  ],
  monthlyComparison: [
    { month: 'Mar', expenses: 39000, income: 75000, savings: 36000 },
    { month: 'Apr', expenses: 44000, income: 75000, savings: 31000 },
    { month: 'May', expenses: 41000, income: 75000, savings: 34000 },
    { month: 'Jun', expenses: 46000, income: 75000, savings: 29000 },
    { month: 'Jul', expenses: 40500, income: 75000, savings: 34500 },
    { month: 'Aug', expenses: 42500, income: 75000, savings: 32500 },
  ],
  outliers: [
    {
      id: 'exp_9',
      description: 'Cult.fit Gym & Fitness Quarterly Pass',
      amount: 6500,
      date: '2026-08-05',
      category: 'Healthcare',
      notes: 'Quarterly fitness subscription',
      tag: 'Fixed Need',
    },
    {
      id: 'exp_3',
      description: 'Amazon Great Freedom Festival Shopping',
      amount: 4850,
      date: '2026-08-18',
      category: 'Shopping',
      notes: 'Large one-time purchase',
      tag: 'Discretionary',
    },
  ],
}

const MOCK_BUDGET = {
  budgetUtilization: 82,
  overspendingAlerts: false,
  overspendingCategoriesCount: 0,
  recommendedMonthlyBudget: 48000,
  suggestedMonthlySavings: 27000,
  potentialMonthlySavings: 4800,
  needsPct: 47.3,
  wantsPct: 16.5,
  savingsPct: 36.2,
  recommendedBudgets: [
    {
      category: 'Food',
      currentSpend: 9850,
      recommendedLimit: 10000,
      rationale: 'Food spending is within range. Maintain current habits and avoid impulse ordering on weekdays.',
      action: 'Maintain buffer',
    },
    {
      category: 'Healthcare',
      currentSpend: 8250,
      recommendedLimit: 10000,
      rationale: 'Healthcare spend is well within limit. Quarterly gym subscription drives this spend up — it\'s justified.',
      action: 'Maintain buffer',
    },
    {
      category: 'Shopping',
      currentSpend: 7200,
      recommendedLimit: 7500,
      rationale: 'Shopping is close to the 10% income threshold. Consider deferring non-essential purchases to next month.',
      action: 'Cap at ₹7,500',
    },
    {
      category: 'Bills',
      currentSpend: 7700,
      recommendedLimit: 9000,
      rationale: 'Utility and maintenance bills are stable. Maintain current budget allocation.',
      action: 'Maintain buffer',
    },
    {
      category: 'Travel',
      currentSpend: 4400,
      recommendedLimit: 6000,
      rationale: 'Travel spend is within budget. You have ₹1,600 headroom remaining this month.',
      action: 'Maintain buffer',
    },
    {
      category: 'Entertainment',
      currentSpend: 2649,
      recommendedLimit: 4000,
      rationale: 'Entertainment spending is healthy at 3.5% of income. No adjustment needed.',
      action: 'Maintain buffer',
    },
    {
      category: 'Education',
      currentSpend: 2199,
      recommendedLimit: 5000,
      rationale: 'Education investment is well below budget — great for skill building. Consider adding more courses.',
      action: 'Maintain buffer',
    },
  ],
}

const MOCK_INVESTMENTS = {
  currentInvestments: 373800,
  investmentBreakdown: {
    'Mutual Funds': 168700,
    Stocks: 100000,
    ETFs: 41500,
    Bonds: 32400,
    'Other Investments': 31200,
  },
  bestPerformerName: 'Parag Parikh Flexi Cap Fund',
  bestPerformerReturnPct: '+29.0%',
  bestPerformerGain: '₹14,500 gain',
  worstPerformerName: 'RBI Floating Rate Savings Bonds',
  worstPerformerReturnPct: '+8.0%',
  worstPerformerGain: '₹2,400 gain',
  diversificationScore: 5.0,
  diversificationSubtitle: 'Moderately diversified across 5 types',
  portfolioBeta: 0.95,
  portfolioBetaSubtitle: 'Lower risk than broader Nifty',
  equityConcentration: 45.2,
  diagnosticAlert: {
    title: 'Your portfolio has a balanced allocation (45% equities).',
    message:
      'Your current asset allocation is well diversified between growth and defensive assets, helping buffer against sudden market corrections while maintaining healthy long-term upside. Consider a monthly SIP top-up into the Parag Parikh Flexi Cap Fund to maximise compounding.',
  },
}

export const analyticsService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/dashboard')
      return response.data.data
    } catch (error) {
      console.warn('Backend API unavailable, using local data for dashboard:', error.message)
      return null
    }
  },

  getSpendingAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/spending')
      return response.data.data
    } catch (error) {
      console.warn('Backend API unavailable, using local data for spending analytics:', error.message)
      return MOCK_SPENDING
    }
  },

  getBudgetAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/budget')
      return response.data.data
    } catch (error) {
      console.warn('Backend API unavailable, using local data for budget analytics:', error.message)
      return MOCK_BUDGET
    }
  },

  getInvestmentAnalytics: async () => {
    try {
      const response = await apiClient.get('/analytics/investments')
      return response.data.data
    } catch (error) {
      console.warn('Backend API unavailable, using local data for investment analytics:', error.message)
      return MOCK_INVESTMENTS
    }
  },

  getFinancialHealth: async () => {
    try {
      const response = await apiClient.get('/analytics/financial-health')
      return response.data.data
    } catch (error) {
      console.warn('Backend API unavailable, using local data for financial health:', error.message)
      return null
    }
  },
}

