export const initialUserData = {
  id: 'usr_101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  mobile: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  monthlyIncome: 75000,
  currency: 'INR (₹)',
  riskPreference: 'Moderate',
  joinedDate: '2025-01-15',
  occupation: 'Senior Software Engineer',
  location: 'Bangalore, India'
}

export const initialExpenses = [
  {
    id: 'exp_1',
    description: 'Swiggy Gourmet Dinner & Groceries',
    amount: 1450,
    category: 'Food',
    date: '2026-08-20',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Family dinner order'
  },
  {
    id: 'exp_2',
    description: 'Uber Office Commute (Weekly Pass)',
    amount: 1200,
    category: 'Travel',
    date: '2026-08-19',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Cab commute to tech park'
  },
  {
    id: 'exp_3',
    description: 'Amazon Great Freedom Festival Shopping',
    amount: 4850,
    category: 'Shopping',
    date: '2026-08-18',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Ergonomic mouse and home essentials'
  },
  {
    id: 'exp_4',
    description: 'Electricity & Broadband Bill (Airtel Xstream)',
    amount: 3200,
    category: 'Bills',
    date: '2026-08-16',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    notes: 'Utility payments'
  },
  {
    id: 'exp_5',
    description: 'Coursera & Udemy AI Masterclass',
    amount: 2199,
    category: 'Education',
    date: '2026-08-14',
    paymentMethod: 'Debit Card',
    status: 'Completed',
    notes: 'Professional upskilling'
  },
  {
    id: 'exp_6',
    description: 'Apollo Pharmacy Medical Supplies & Tests',
    amount: 1750,
    category: 'Healthcare',
    date: '2026-08-12',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Annual health check tests'
  },
  {
    id: 'exp_7',
    description: 'PVR IMAX Movie Tickets & Popcorn',
    amount: 1650,
    category: 'Entertainment',
    date: '2026-08-10',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Weekend movie with friends'
  },
  {
    id: 'exp_8',
    description: 'Blue Tokai Specialty Coffee Beans',
    amount: 850,
    category: 'Food',
    date: '2026-08-08',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Home roasted coffee'
  },
  {
    id: 'exp_9',
    description: 'Cult.fit Gym & Fitness Quarterly Pass',
    amount: 6500,
    category: 'Healthcare',
    date: '2026-08-05',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Fitness center subscription'
  },
  {
    id: 'exp_10',
    description: 'Apartment Maintenance & Water Bill',
    amount: 4500,
    category: 'Bills',
    date: '2026-08-02',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    notes: 'Society maintenance charges'
  },
  {
    id: 'exp_11',
    description: 'Blinkit Instant Groceries Delivery',
    amount: 1120,
    category: 'Food',
    date: '2026-08-01',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Daily dairy and vegetables'
  },
  {
    id: 'exp_12',
    description: 'Petrol Refuel for Car (Shell Fuel)',
    amount: 3200,
    category: 'Travel',
    date: '2026-07-28',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Full tank refuel'
  },
  {
    id: 'exp_13',
    description: 'Zara Casual Wear & Footwear',
    amount: 5490,
    category: 'Shopping',
    date: '2026-07-25',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    notes: 'Office casual clothing'
  },
  {
    id: 'exp_14',
    description: 'Netflix & Spotify Premium Family Plan',
    amount: 999,
    category: 'Entertainment',
    date: '2026-07-20',
    paymentMethod: 'Debit Card',
    status: 'Completed',
    notes: 'Monthly digital subscriptions'
  },
  {
    id: 'exp_15',
    description: 'Donation to Animal Rescue NGO',
    amount: 2000,
    category: 'Other',
    date: '2026-07-15',
    paymentMethod: 'UPI',
    status: 'Completed',
    notes: 'Charitable donation 80G'
  }
]

export const initialBudgets = [
  {
    id: 'bud_1',
    name: 'Monthly Food & Groceries',
    category: 'Food',
    limit: 12000,
    spent: 9850,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#f97316'
  },
  {
    id: 'bud_2',
    name: 'Travel & Commute Allowance',
    category: 'Travel',
    limit: 6000,
    spent: 4400,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#06b6d4'
  },
  {
    id: 'bud_3',
    name: 'Shopping & Lifestyle',
    category: 'Shopping',
    limit: 8000,
    spent: 7200,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#ec4899'
  },
  {
    id: 'bud_4',
    name: 'Utility Bills & Maintenance',
    category: 'Bills',
    limit: 9000,
    spent: 7700,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#eab308'
  },
  {
    id: 'bud_5',
    name: 'Education & Professional Upskilling',
    category: 'Education',
    limit: 5000,
    spent: 2199,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#8b5cf6'
  },
  {
    id: 'bud_6',
    name: 'Healthcare & Wellness',
    category: 'Healthcare',
    limit: 10000,
    spent: 8250,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#10b981'
  },
  {
    id: 'bud_7',
    name: 'Entertainment & Leisure',
    category: 'Entertainment',
    limit: 4000,
    spent: 2649,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    color: '#6366f1'
  }
]

export const initialInvestments = [
  {
    id: 'inv_1',
    name: 'HDFC Nifty 50 Index Fund',
    type: 'Mutual Funds',
    investedAmount: 85000,
    currentValue: 104200,
    purchaseDate: '2024-03-15',
    quantity: 650.42,
    riskLevel: 'Moderate',
    notes: 'Monthly SIP of ₹5,000'
  },
  {
    id: 'inv_2',
    name: 'Tata Consultancy Services (TCS)',
    type: 'Stocks',
    investedAmount: 45000,
    currentValue: 53800,
    purchaseDate: '2023-11-10',
    quantity: 14,
    riskLevel: 'Low',
    notes: 'Large cap IT blue chip'
  },
  {
    id: 'inv_3',
    name: 'Reliance Industries Ltd',
    type: 'Stocks',
    investedAmount: 40000,
    currentValue: 46200,
    purchaseDate: '2024-01-20',
    quantity: 16,
    riskLevel: 'Moderate',
    notes: 'Core long term holding'
  },
  {
    id: 'inv_4',
    name: 'Nippon India Gold ETF (BeES)',
    type: 'ETFs',
    investedAmount: 35000,
    currentValue: 41500,
    purchaseDate: '2024-04-05',
    quantity: 620,
    riskLevel: 'Low',
    notes: 'Hedge against market inflation'
  },
  {
    id: 'inv_5',
    name: 'RBI Floating Rate Savings Bonds',
    type: 'Bonds',
    investedAmount: 30000,
    currentValue: 32400,
    purchaseDate: '2023-09-01',
    quantity: 30,
    riskLevel: 'Low',
    notes: 'Government backed sovereign bond'
  },
  {
    id: 'inv_6',
    name: 'Parag Parikh Flexi Cap Fund',
    type: 'Mutual Funds',
    investedAmount: 50000,
    currentValue: 64500,
    purchaseDate: '2024-02-12',
    quantity: 710.15,
    riskLevel: 'Moderate',
    notes: 'Diversified global and Indian equity fund'
  },
  {
    id: 'inv_7',
    name: 'Sovereign Gold Bond (SGB 2024-Series)',
    type: 'Other Investments',
    investedAmount: 25000,
    currentValue: 31200,
    purchaseDate: '2024-05-18',
    quantity: 4,
    riskLevel: 'Low',
    notes: '2.5% annual interest + capital appreciation'
  }
]

export const initialGoals = [
  {
    id: 'gol_1',
    name: 'Emergency Fund (6 Months Expenses)',
    type: 'Emergency Fund',
    targetAmount: 250000,
    savedAmount: 185000,
    targetDate: '2026-12-31',
    priority: 'High',
    notes: 'Parked in high yield liquid funds and FD'
  },
  {
    id: 'gol_2',
    name: 'Japan & Bali Vacation Trip',
    type: 'Travel',
    targetAmount: 150000,
    savedAmount: 90000,
    targetDate: '2027-04-15',
    priority: 'Medium',
    notes: 'Flights and hotel accommodation fund'
  },
  {
    id: 'gol_3',
    name: 'Electric Vehicle (Tata Nexon EV) Downpayment',
    type: 'Car',
    targetAmount: 400000,
    savedAmount: 220000,
    targetDate: '2027-10-30',
    priority: 'High',
    notes: 'Target 30% downpayment to reduce loan EMI'
  },
  {
    id: 'gol_4',
    name: 'Luxury Apartment Down Payment',
    type: 'House',
    targetAmount: 1500000,
    savedAmount: 450000,
    targetDate: '2029-12-31',
    priority: 'High',
    notes: 'Long term home savings plan'
  },
  {
    id: 'gol_5',
    name: 'Retirement Wealth Corpus',
    type: 'Retirement',
    targetAmount: 20000000,
    savedAmount: 2800000,
    targetDate: '2045-06-30',
    priority: 'High',
    notes: 'NPS, EPF, and equity index SIP compounders'
  }
]

export const initialNotifications = [
  {
    id: 'notif_1',
    title: 'Budget Alert: Food & Groceries',
    message: 'Your Food budget is 82% used. Consider monitoring non-essential dining expenses.',
    type: 'warning',
    timestamp: '2026-08-21T10:30:00Z',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Savings Milestone Reached',
    message: 'Congratulations! Your monthly savings increased by 12% compared to last month.',
    type: 'success',
    timestamp: '2026-08-20T16:45:00Z',
    read: false
  },
  {
    id: 'notif_3',
    title: 'Investment Portfolio Growth',
    message: 'Your investment portfolio value increased by ₹4,500 (+1.8%) this week.',
    type: 'info',
    timestamp: '2026-08-19T09:15:00Z',
    read: false
  },
  {
    id: 'notif_4',
    title: 'Goal Progress Update',
    message: 'Your Travel Goal (Japan Vacation) is now 60% completed. You are on track for April 2027.',
    type: 'success',
    timestamp: '2026-08-18T14:20:00Z',
    read: true
  },
  {
    id: 'notif_5',
    title: 'Bill Reminder: Airtel Broadband',
    message: 'Upcoming bill due date in 3 days for broadband service.',
    type: 'warning',
    timestamp: '2026-08-15T11:00:00Z',
    read: true
  }
]

export const analyticsData = {
  monthlyComparison: [
    { month: 'Mar', income: 72000, expenses: 39000, savings: 33000 },
    { month: 'Apr', income: 72000, expenses: 44000, savings: 28000 },
    { month: 'May', income: 75000, expenses: 41000, savings: 34000 },
    { month: 'Jun', income: 75000, expenses: 46000, savings: 29000 },
    { month: 'Jul', income: 75000, expenses: 40500, savings: 34500 },
    { month: 'Aug', income: 75000, expenses: 42500, savings: 32500 }
  ],
  categorySpending: [
    { name: 'Food', value: 9850, color: '#f97316' },
    { name: 'Travel', value: 4400, color: '#06b6d4' },
    { name: 'Shopping', value: 7200, color: '#ec4899' },
    { name: 'Bills', value: 7700, color: '#eab308' },
    { name: 'Education', value: 2199, color: '#8b5cf6' },
    { name: 'Healthcare', value: 8250, color: '#10b981' },
    { name: 'Entertainment', value: 2649, color: '#6366f1' },
    { name: 'Other', value: 2000, color: '#64748b' }
  ],
  healthScores: {
    overall: 78,
    breakdown: [
      { category: 'Savings Rate', score: 80, benchmark: 70, status: 'Excellent' },
      { category: 'Budget Management', score: 75, benchmark: 70, status: 'Good' },
      { category: 'Investments Diversification', score: 82, benchmark: 75, status: 'Excellent' },
      { category: 'Debt Management', score: 70, benchmark: 65, status: 'Moderate' }
    ]
  },
  aiRecommendations: [
    {
      title: 'Food Expense Optimization',
      insight: 'Your dining & food expenses increased by 18% compared with last month.',
      recommendation: 'Recommended monthly food budget is ₹7,500/month. Cooking at home 2 extra days weekly can save ₹2,800/mo.'
    },
    {
      title: 'Target Savings Enhancement',
      insight: 'Your current savings rate is 43.3% of total income.',
      recommendation: 'Suggested monthly savings target is ₹35,000. Allocate ₹10,000 extra towards your Emergency Fund goal.'
    },
    {
      title: 'Portfolio Rebalancing',
      insight: 'Your portfolio is heavily concentrated in equity index funds (62%).',
      recommendation: 'Consider allocating 10% more into Sovereign Gold Bonds or Fixed Income instruments for better downside protection.'
    }
  ]
}
