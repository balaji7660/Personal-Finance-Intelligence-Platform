import { formatCurrency } from '../utils/currencyFormatter'
import { userService } from './userService'

const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const STORAGE_KEY = 'finsight_gemini_api_key'

export const getGeminiApiKey = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_GEMINI_KEY
  } catch (e) {
    return DEFAULT_GEMINI_KEY
  }
}

export const saveGeminiApiKey = (key) => {
  try {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim())
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (e) {
    console.warn('Could not save Gemini key to storage:', e)
  }
}

/**
 * Calls the Google Gemini REST API across fallback models.
 */
export const callGeminiApi = async (systemInstruction, userPrompt, customKey = null) => {
  const apiKey = customKey || getGeminiApiKey()
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ]

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemInstruction}\n\nUser Question/Command:\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 1500,
    },
  }

  for (const modelName of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response && response.ok) {
        const resJson = await response.json()
        const candidates = resJson?.candidates || []
        if (candidates.length > 0) {
          const parts = candidates[0]?.content?.parts || []
          if (parts.length > 0 && parts[0]?.text) {
            return {
              text: parts[0].text,
              model: modelName,
            }
          }
        }
      }
    } catch (err) {
      // safe ignore and continue to next fallback
    }
  }

  return null
}

/**
 * Extracts numeric amounts from natural language strings.
 * Handles ₹, Rs, k (thousands), l/lakh/lakhs.
 */
export const extractAmount = (text) => {
  if (!text || typeof text !== 'string') return null
  const lower = text.toLowerCase()

  const mk = lower.match(/(\d+(?:\.\d+)?)\s*k\b/)
  if (mk) return parseFloat(mk[1]) * 1000

  const ml = lower.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs|lac|lacs)\b/)
  if (ml) return parseFloat(ml[1]) * 100000

  const mn = lower.match(/(?:rs\.?|rupees|₹)?\s*(\d+(?:,\d+)*(?:\.\d+)?)/)
  if (mn) {
    const raw = mn[1].replace(/,/g, '')
    const val = parseFloat(raw)
    if (!isNaN(val) && val > 0) return val
  }

  return null
}

export const CATEGORIES_MAP = {
  swiggy: 'Food',
  zomato: 'Food',
  groceries: 'Food',
  grocery: 'Food',
  food: 'Food',
  dining: 'Food',
  restaurant: 'Food',
  dinner: 'Food',
  lunch: 'Food',
  coffee: 'Food',
  uber: 'Travel',
  ola: 'Travel',
  cab: 'Travel',
  commute: 'Travel',
  travel: 'Travel',
  petrol: 'Travel',
  diesel: 'Travel',
  flight: 'Travel',
  train: 'Travel',
  amazon: 'Shopping',
  flipkart: 'Shopping',
  myntra: 'Shopping',
  shopping: 'Shopping',
  clothes: 'Shopping',
  zara: 'Shopping',
  electricity: 'Bills',
  broadband: 'Bills',
  wifi: 'Bills',
  airtel: 'Bills',
  jio: 'Bills',
  maintenance: 'Bills',
  utility: 'Bills',
  bills: 'Bills',
  bill: 'Bills',
  coursera: 'Education',
  udemy: 'Education',
  books: 'Education',
  education: 'Education',
  course: 'Education',
  apollo: 'Healthcare',
  pharmacy: 'Healthcare',
  hospital: 'Healthcare',
  medical: 'Healthcare',
  doctor: 'Healthcare',
  medicine: 'Healthcare',
  cult: 'Healthcare',
  gym: 'Healthcare',
  fitness: 'Healthcare',
  healthcare: 'Healthcare',
  pvr: 'Entertainment',
  imax: 'Entertainment',
  movie: 'Entertainment',
  netflix: 'Entertainment',
  spotify: 'Entertainment',
  hotstar: 'Entertainment',
  entertainment: 'Entertainment',
  mutual: 'Mutual Funds',
  sip: 'Mutual Funds',
  stocks: 'Stocks',
  shares: 'Stocks',
  etf: 'ETFs',
  bonds: 'Bonds',
  gold: 'Gold',
  sgb: 'Gold',
}

/**
 * Builds comprehensive prompt loaded with the user's live profile,
 * complete historical logged transactions, budgets, goals, and portfolio holdings.
 */
export const buildSystemPrompt = ({
  user = {},
  metrics = {},
  expenses = [],
  budgets = [],
  goals = [],
  investments = [],
}) => {
  const userName = (user?.name || user?.username || 'User').trim()
  const userEmail = user?.email || 'user@example.com'
  const userMobile = user?.mobile || 'Not set'
  const userOccupation = user?.occupation || 'Member'
  const userLocation = user?.location || 'India'
  const userIncome = Number(user?.monthlyIncome || metrics?.totalIncome || 0)
  const userCurrency = user?.currency || 'INR (₹)'
  const userRisk = user?.riskPreference || 'Moderate'
  const userJoined = user?.joinedDate || 'Recent'

  const validExpenses = Array.isArray(expenses) ? expenses.filter(Boolean) : []
  const validBudgets = Array.isArray(budgets) ? budgets.filter(Boolean) : []
  const validInvestments = Array.isArray(investments) ? investments.filter(Boolean) : []
  const validGoals = Array.isArray(goals) ? goals.filter(Boolean) : []

  const totExpenses = Number(metrics?.totalExpenses || validExpenses.reduce((a, b) => a + Number(b?.amount || 0), 0))
  const netSavings = Math.max(0, userIncome - totExpenses)
  const savingsRate = userIncome > 0 ? Math.round((netSavings / userIncome) * 100) : 0
  const totInvested = Number(metrics?.totalInvested || validInvestments.reduce((a, b) => a + Number(b?.investedAmount || b?.amount || 0), 0))
  const curInvestValue = Number(metrics?.currentInvestmentValue || validInvestments.reduce((a, b) => a + Number(b?.currentValue || 0), 0))
  const totalGains = curInvestValue - totInvested
  const returnsPct = totInvested > 0 ? ((totalGains / totInvested) * 100).toFixed(1) : '0.0'
  const healthScore = metrics?.healthScore || 78

  // Itemized logged expenses list (top 15)
  const loggedExpensesList = validExpenses.slice(0, 15).map((e) => {
    const amt = Number(e?.amount || 0)
    return `• ${e?.date || 'Recent'}: "${e?.description || e?.title || e?.category || 'Expense'}" - ₹${amt.toLocaleString('en-IN')} [${e?.category || 'General'}] via ${e?.paymentMethod || 'UPI'}${e?.notes ? ` (Notes: ${e.notes})` : ''}`
  }).join('\n')

  // Category Budgets breakdown
  const budgetsList = validBudgets.map((b) => {
    const limit = Number(b?.limit || 0)
    const spent = Number(b?.spent || 0)
    const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0
    const alert = pct >= 80 ? ` [⚠️ ${pct}% UTILIZED - ALERT]` : ` [${pct}% utilized]`
    return `• ${b?.category || b?.name || 'Category'}: Cap ₹${limit.toLocaleString('en-IN')}, Spent ₹${spent.toLocaleString('en-IN')}, Remaining ₹${Math.max(0, limit - spent).toLocaleString('en-IN')}${alert}`
  }).join('\n')

  // Investment Portfolio breakdown
  const investmentsList = validInvestments.map((i) => {
    const inv = Number(i?.investedAmount || i?.amount || 0)
    const cur = Number(i?.currentValue || inv * 1.12)
    const diff = cur - inv
    return `• ${i?.name || i?.source || 'Asset'} (${i?.type || 'Asset'}): Invested ₹${inv.toLocaleString('en-IN')}, Current Value ₹${cur.toLocaleString('en-IN')} (${diff >= 0 ? '+' : ''}₹${diff.toLocaleString('en-IN')})`
  }).join('\n')

  // Financial Goals breakdown
  const goalsList = validGoals.map((g) => {
    const target = Number(g?.targetAmount || g?.target_amount || 0)
    const cur = Number(g?.currentAmount || 0)
    const pct = target > 0 ? Math.round((cur / target) * 100) : 0
    return `• ${g?.title || g?.goal_name || 'Goal'}: Target ₹${target.toLocaleString('en-IN')}, Accumulated ₹${cur.toLocaleString('en-IN')} (${pct}% complete, Target Date: ${g?.targetDate || '2026-12-31'})`
  }).join('\n')

  return `
You are FinSight AI Assistant — an ultra-intelligent, fast, and friendly conversational AI financial engine powered by Google Gemini, operating as the central intelligence of FinSight. You have complete live access to the user's profile and entire logged financial database.

USER PROFILE:
- Full Name: ${userName}
- Email: ${userEmail}
- Mobile: ${userMobile}
- Occupation: ${userOccupation}
- Location: ${userLocation}
- Monthly Income: ₹${userIncome.toLocaleString('en-IN')}
- Currency: ${userCurrency}
- Risk Preference: ${userRisk}
- Member Since: ${userJoined}

FINANCIAL TOTALS & HEALTH METRICS:
- Total Monthly Income: ₹${userIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${totExpenses.toLocaleString('en-IN')}
- Net Monthly Savings: ₹${netSavings.toLocaleString('en-IN')}
- Savings Rate: ${savingsRate}%
- Total Portfolio Invested: ₹${totInvested.toLocaleString('en-IN')}
- Portfolio Current Value: ₹${curInvestValue.toLocaleString('en-IN')} (+₹${totalGains.toLocaleString('en-IN')} / +${returnsPct}%)
- Financial Health Score: ${healthScore}/100 (Top Tier Stability)

PREVIOUSLY LOGGED EXPENSES & TRANSACTIONS:
${loggedExpensesList || 'No expense records found.'}

ACTIVE CATEGORY BUDGETS:
${budgetsList || 'No budgets configured.'}

INVESTMENT PORTFOLIO HOLDINGS:
${investmentsList || 'No investments recorded.'}

ACTIVE FINANCIAL GOALS:
${goalsList || 'No goals configured.'}

LANGUAGE & CONVERSATIONAL DIRECTIVES:
1. DEFAULT LANGUAGE: Always answer in clear, polished, helpful, and professional English by default.
2. USER LANGUAGE MIRRORING:
   - If the user writes in Telugu / Teluglish (e.g., "ela unnav", "cheppu", "naa kharchulu enti", "naa profile cheppu"), respond warmly in Telugu / Teluglish.
   - If the user writes in Hindi (e.g., "mera kharcha kitna hai", "budget batao"), respond in Hindi.
   - Mirror any other requested language smoothly.
3. PREVIOUS DATA QUERIES:
   - When asked about previous expenses, budgets, investments, goals, or profile details, quote the exact figures and dates from the data provided above.
4. REAL-TIME ACTIONS:
   If the user asks to add, record, set, or delete an item, output a JSON action block on the VERY FIRST LINE of your response in this exact format:

   [[ACTION: {"type": "ADD_EXPENSE", "amount": 2500, "category": "Food", "description": "Swiggy dinner", "notes": "family dinner"}]]
   or
   [[ACTION: {"type": "ADD_INCOME", "amount": 50000, "source": "Salary"}]]
   or
   [[ACTION: {"type": "SET_BUDGET", "amount": 15000, "category": "Food"}]]
   or
   [[ACTION: {"type": "ADD_GOAL", "amount": 100000, "goal_name": "Emergency Fund"}]]
   or
   [[ACTION: {"type": "ADD_INVESTMENT", "amount": 10000, "source": "Mutual Funds", "name": "Tata Digital Fund"}]]
   or
   [[ACTION: {"type": "DELETE_ALL_EXPENSES"}]]
   or
   [[ACTION: {"type": "DELETE_ALL_BUDGETS"}]]
   or
   [[ACTION: {"type": "DELETE_ALL_GOALS"}]]
   or
   [[ACTION: {"type": "DELETE_ALL_INVESTMENTS"}]]
   or
   [[ACTION: {"type": "RESET_ALL_DATA"}]]

   Categories supported: Food, Travel, Shopping, Bills, Education, Healthcare, Entertainment, Other.

   If NO action or database modification is required, do NOT output any [[ACTION:...]] block. Always provide clean Markdown formatting.
`
}

/**
 * Intelligent local intent parser for handling queries and actions when offline or with fallback.
 */
const handleLocalQueryAndIntent = ({
  prompt,
  user,
  financeContext,
}) => {
  try {
    const pLower = (prompt || '').toLowerCase()
    const userName = (user?.name || user?.username || 'User').trim()
    const userIncome = Number(user?.monthlyIncome || financeContext?.metrics?.totalIncome || 0)
    const expenses = Array.isArray(financeContext?.expenses) ? financeContext.expenses.filter(Boolean) : []
    const budgets = Array.isArray(financeContext?.budgets) ? financeContext.budgets.filter(Boolean) : []
    const investments = Array.isArray(financeContext?.investments) ? financeContext.investments.filter(Boolean) : []
    const goals = Array.isArray(financeContext?.goals) ? financeContext.goals.filter(Boolean) : []
    const metrics = financeContext?.metrics || {}

    // 1. Profile Queries
    if (
      pLower.includes('profile') ||
      pLower.includes('who am i') ||
      pLower.includes('my details') ||
      pLower.includes('account details') ||
      pLower.includes('salary') ||
      pLower.includes('my income') ||
      pLower.includes('occupation') ||
      pLower.includes('my email') ||
      pLower.includes('mobile') ||
      pLower.includes('location') ||
      pLower.includes('risk preference')
    ) {
      return {
        reply: `Here are your verified profile and account details, **${userName}**:\n\n` +
          `• **Full Name:** ${user?.name || user?.username || 'Not set'}\n` +
          `• **Occupation:** ${user?.occupation || 'Not set'}\n` +
          `• **Location:** ${user?.location || 'Not set'}\n` +
          `• **Monthly Income:** ₹${userIncome.toLocaleString('en-IN')}\n` +
          `• **Email:** ${user?.email || 'Not set'}\n` +
          `• **Mobile:** ${user?.mobile || 'Not set'}\n` +
          `• **Risk Preference:** ${user?.riskPreference || 'Moderate'}\n` +
          `• **Member Since:** ${user?.joinedDate || 'Recent'}\n` +
          `• **Financial Health Score:** ${metrics.healthScore || 78}/100`,
      }
    }

    // 2. Budget Alert / Status Queries
    if (
      pLower.includes('budget') &&
      (pLower.includes('alert') ||
        pLower.includes('exceed') ||
        pLower.includes('high') ||
        pLower.includes('over') ||
        pLower.includes('status') ||
        pLower.includes('which') ||
        pLower.includes('limit') ||
        pLower.includes('80%') ||
        pLower.includes('utilization'))
    ) {
      const alerts = budgets.filter((b) => {
        const limit = Number(b?.limit || 0)
        const spent = Number(b?.spent || 0)
        return limit > 0 && spent / limit >= 0.8
      })

      if (alerts.length > 0) {
        const alertLines = alerts
          .map((b) => {
            const pct = Math.round(
              (Number(b?.spent || 0) / Number(b?.limit || 1)) * 100
            )
            return `• **${b?.category || b?.name}:** ₹${Number(
              b?.spent || 0
            ).toLocaleString('en-IN')} spent of ₹${Number(
              b?.limit || 0
            ).toLocaleString('en-IN')} (${pct}% utilized - ⚠️ Warning threshold)`
          })
          .join('\n')

        return {
          reply: `Here is your current **Budget Utilization & Alert Status**:\n\n${alertLines}\n\n💡 **Optimization Tip:** Consider trimming discretionary spending on ${alerts
            .map((a) => a?.category || 'these categories')
            .join(
              ' & '
            )} over the next 10 days to keep your monthly savings rate on track!`,
        }
      } else {
        const allBudgets = budgets
          .map(
            (b) =>
              `• **${b?.category || b?.name}:** ₹${Number(
                b?.spent || 0
              ).toLocaleString('en-IN')} / ₹${Number(
                b?.limit || 0
              ).toLocaleString('en-IN')}`
          )
          .join('\n')
        return {
          reply: `All your category budgets are currently within safe limits (<80% utilized):\n\n${
            allBudgets || 'No active category budgets configured.'
          }`,
        }
      }
    }

    // 3. Category / Specific / All Expense Queries
    const matchedCategory = Object.keys(CATEGORIES_MAP).find((k) =>
      pLower.includes(k)
    )
    if (
      matchedCategory &&
      (pLower.includes('spend') ||
        pLower.includes('expense') ||
        pLower.includes('cost') ||
        pLower.includes('how much') ||
        pLower.includes('history') ||
        pLower.includes('last') ||
        pLower.includes('logged') ||
        pLower.includes('dining'))
    ) {
      const targetCat = CATEGORIES_MAP[matchedCategory]
      const matchedExpenses = expenses.filter(
        (e) =>
          (e?.category && e.category.toLowerCase() === targetCat.toLowerCase()) ||
          (e?.description &&
            e.description.toLowerCase().includes(matchedCategory))
      )

      if (matchedExpenses.length > 0) {
        const totalCatSpent = matchedExpenses.reduce(
          (a, b) => a + Number(b?.amount || 0),
          0
        )
        const list = matchedExpenses
          .slice(0, 5)
          .map(
            (e) =>
              `• **${e?.date || 'Recent'}:** ${
                e?.description || e?.title || 'Expense'
              } - ₹${Number(e?.amount || 0).toLocaleString('en-IN')} (${
                e?.paymentMethod || 'UPI'
              })`
          )
          .join('\n')
        return {
          reply: `Here are your logged expenditures for **${targetCat}** (Total: **₹${totalCatSpent.toLocaleString(
            'en-IN'
          )}**):\n\n${list}`,
        }
      } else {
        return {
          reply: `You currently have no logged expenses recorded under **${targetCat}**. You can tell me to record one (e.g. "Add ₹450 dinner under Food") anytime!`,
        }
      }
    }

    if (
      pLower.includes('all expense') ||
      pLower.includes('all transactions') ||
      pLower.includes('transaction history') ||
      pLower.includes('logged expense') ||
      pLower.includes('recent expense') ||
      (pLower.includes('expense') && (pLower.includes('show') || pLower.includes('list') || pLower.includes('what')))
    ) {
      if (expenses.length > 0) {
        const totalSpent = expenses.reduce((a, b) => a + Number(b?.amount || 0), 0)
        const list = expenses
          .slice(0, 6)
          .map(
            (e) =>
              `• **${e?.date || 'Recent'}:** ${
                e?.description || e?.title || 'Expense'
              } - ₹${Number(e?.amount || 0).toLocaleString('en-IN')} [${
                e?.category || 'General'
              }]`
          )
          .join('\n')
        return {
          reply: `Here is your recent logged transaction history (Total Logged: **₹${totalSpent.toLocaleString(
            'en-IN'
          )}**):\n\n${list}`,
        }
      } else {
        return {
          reply: `You have no expense transactions recorded yet. Tell me anytime: "Spent ₹500 on groceries" to log one!`,
        }
      }
    }

    // 4. Investment Portfolio Queries
    if (
      pLower.includes('investment') ||
      pLower.includes('portfolio') ||
      pLower.includes('stock') ||
      pLower.includes('mutual fund') ||
      pLower.includes('gold') ||
      pLower.includes('returns') ||
      pLower.includes('holdings')
    ) {
      const totalInv = Number(
        metrics.totalInvested ||
          investments.reduce(
            (a, b) => a + Number(b?.investedAmount || b?.amount || 0),
            0
          )
      )
      const curVal = Number(
        metrics.currentInvestmentValue ||
          investments.reduce(
            (a, b) => a + Number(b?.currentValue || 0),
            0
          )
      )
      const gain = curVal - totalInv
      const list = investments
        .slice(0, 6)
        .map(
          (i) =>
            `• **${i?.name || 'Asset'}** (${i?.type || 'Asset'}): Invested ₹${Number(
              i?.investedAmount || i?.amount || 0
            ).toLocaleString('en-IN')} ➔ Current: ₹${Number(
              i?.currentValue || 0
            ).toLocaleString('en-IN')}`
        )
        .join('\n')

      return {
        reply:
          `Here is your live **Investment Portfolio Summary** for **${userName}**:\n\n` +
          `• **Total Invested:** ₹${totalInv.toLocaleString('en-IN')}\n` +
          `• **Current Value:** ₹${curVal.toLocaleString('en-IN')} (+₹${gain.toLocaleString(
            'en-IN'
          )} / +${
            totalInv > 0 ? ((gain / totalInv) * 100).toFixed(1) : 0
          }%)\n\n` +
          `**Key Holdings:**\n${list || 'No investments recorded yet.'}`,
      }
    }

    // 5. Goals Queries
    if (
      pLower.includes('goal') ||
      pLower.includes('target') ||
      pLower.includes('milestone') ||
      pLower.includes('emergency fund') ||
      pLower.includes('vacation')
    ) {
      const list = goals
        .map((g) => {
          const pct = Math.round(
            (Number(g?.currentAmount || 0) / Number(g?.targetAmount || 1)) * 100
          )
          return `• **${g?.title || 'Goal'}:** ₹${Number(
            g?.currentAmount || 0
          ).toLocaleString('en-IN')} / ₹${Number(
            g?.targetAmount || 0
          ).toLocaleString('en-IN')} (${pct}% complete, Target: ${
            g?.targetDate || '2026-12-31'
          })`
        })
        .join('\n')

      return {
        reply: `Here are your active **Financial Goals & Life Milestones**:\n\n${
          list || 'No goals created yet.'
        }`,
      }
    }

    // 6. Multilingual Greetings & Queries
    if (
      pLower.includes('ela unnav') ||
      pLower.includes('cheppu') ||
      pLower.includes('bavunnava') ||
      pLower.includes('kharchulu') ||
      pLower.includes('telugu') ||
      pLower.includes('namaste')
    ) {
      if (pLower.includes('namaste') && !pLower.includes('cheppu') && !pLower.includes('telugu')) {
        return {
          reply: `Namaste **${userName}**! 🙏 Aapka live financial report tayyar hai:\n\n• **Monthly Salary:** ₹${userIncome.toLocaleString(
            'en-IN'
          )}\n• **Total Kharcha:** ₹${Number(
            metrics.totalExpenses || 0
          ).toLocaleString('en-IN')}\n• **Net Savings:** ₹${Number(
            metrics.totalSavings || 0
          ).toLocaleString('en-IN')}\n• **Financial Health Score:** ${
            metrics.healthScore || 78
          }/100\n\nAap mujhse koi bhi naya expense record karne ya budget check karne ke liye bol sakte hain!`,
        }
      }

      return {
        reply: `Namaste **${userName}**! 🙏 Nenu chala bagunnanu.\n\nMeeru adigina live details:\n• **Monthly Income:** ₹${userIncome.toLocaleString(
          'en-IN'
        )}\n• **Total Expenses:** ₹${Number(
          metrics.totalExpenses || 0
        ).toLocaleString('en-IN')}\n• **Net Savings:** ₹${Number(
          metrics.totalSavings || 0
        ).toLocaleString('en-IN')}\n• **Health Score:** ${
          metrics.healthScore || 78
        }/100\n\nInka meeku emaina kottha expenses add cheyyala leda budget set cheyyala?`,
      }
    }

    if (pLower.includes('namaste') || pLower.includes('kaisa') || pLower.includes('kaise')) {
      return {
        reply: `Namaste **${userName}**! 🙏 Aapka live financial report tayyar hai:\n\n• **Monthly Salary:** ₹${userIncome.toLocaleString('en-IN')}\n• **Total Kharcha:** ₹${Number(metrics.totalExpenses || 0).toLocaleString('en-IN')}\n• **Net Savings:** ₹${Number(metrics.totalSavings || 0).toLocaleString('en-IN')}\n• **Financial Health Score:** ${metrics.healthScore || 78}/100\n\nAap mujhse koi bhi naya expense record karne ya budget check karne ke liye bol sakte hain!`,
      }
    }
  } catch (e) {
    console.warn('Error in local intent engine:', e)
  }

  return null
}

/**
 * Main function to process an AI user prompt, execute actions against FinanceContext, and return formatted output.
 */
export const processAiMessage = async ({
  prompt = '',
  user = {},
  financeContext = {},
  customApiKey = null,
}) => {
  const userName = (user?.name || user?.username || 'User').trim()
  let replyText = ''
  let actionData = null
  let actionExecuted = null
  let poweredBy = 'FinSight Financial Engine ⚡'

  try {
    const systemInstruction = buildSystemPrompt({
      user,
      metrics: financeContext?.metrics || {},
      expenses: financeContext?.expenses || [],
      budgets: financeContext?.budgets || [],
      goals: financeContext?.goals || [],
      investments: financeContext?.investments || [],
    })

    const geminiResult = await callGeminiApi(systemInstruction, prompt, customApiKey)

    if (geminiResult && geminiResult.text) {
      poweredBy = `Google Gemini AI (${geminiResult.model}) 🤖`
      const rawText = geminiResult.text
      const actionMatch = rawText.match(/\[\[ACTION:\s*(\{.*?\})\s*\]\]/s)
      replyText = rawText.replace(/\[\[ACTION:\s*\{.*?\}\s*\]\]/s, '').trim()

      if (actionMatch) {
        try {
          actionData = JSON.parse(actionMatch[1])
        } catch (err) {
          console.warn('Failed to parse JSON action from Gemini:', err)
        }
      }
    }
  } catch (promptErr) {
    console.warn('Gemini prompt generation skipped:', promptErr)
  }

  // If Gemini produced no action block or was unavailable, perform local Intent Parsing
  if (!actionData) {
    const pLower = (prompt || '').toLowerCase().trim()
    const isQuery =
      pLower.startsWith('how') ||
      pLower.startsWith('what') ||
      pLower.startsWith('show') ||
      pLower.startsWith('list') ||
      pLower.startsWith('tell') ||
      pLower.startsWith('check') ||
      pLower.startsWith('which') ||
      pLower.startsWith('who') ||
      pLower.startsWith('can you show') ||
      pLower.startsWith('give me') ||
      pLower.includes('?') ||
      pLower.includes('how much') ||
      pLower.includes('details') ||
      pLower.includes('history') ||
      pLower.includes('status') ||
      pLower.includes('cheppu') ||
      pLower.includes('batao')

    const amt = extractAmount(prompt)

    let detectedCategory = 'Food'
    for (const [kw, cat] of Object.entries(CATEGORIES_MAP)) {
      if (pLower.includes(kw)) {
        detectedCategory = cat
        break
      }
    }

    if (pLower.includes('delete all') || pLower.includes('clear all') || pLower.includes('reset all') || pLower.includes('remove all')) {
      if (pLower.includes('expense')) {
        actionData = { type: 'DELETE_ALL_EXPENSES' }
      } else if (pLower.includes('budget')) {
        actionData = { type: 'DELETE_ALL_BUDGETS' }
      } else if (pLower.includes('goal')) {
        actionData = { type: 'DELETE_ALL_GOALS' }
      } else if (pLower.includes('investment')) {
        actionData = { type: 'DELETE_ALL_INVESTMENTS' }
      } else if (pLower.includes('data') || pLower.includes('everything')) {
        actionData = { type: 'RESET_ALL_DATA' }
      }
    } else if (!isQuery && amt && amt > 0) {
      if (
        pLower.includes('add income') ||
        pLower.includes('income of') ||
        pLower.includes('received salary') ||
        pLower.includes('got salary') ||
        pLower.includes('salary is') ||
        pLower.includes('bonus of') ||
        pLower.includes('earned')
      ) {
        actionData = {
          type: 'ADD_INCOME',
          amount: amt,
          source: pLower.includes('bonus') ? 'Bonus' : pLower.includes('freelance') ? 'Freelance' : 'Salary',
        }
      } else if (
        pLower.includes('add expense') ||
        pLower.includes('spent') ||
        pLower.includes('paid') ||
        pLower.includes('bought') ||
        pLower.includes('expense of') ||
        pLower.includes('record expense') ||
        pLower.includes('bill of')
      ) {
        actionData = {
          type: 'ADD_EXPENSE',
          amount: amt,
          category: detectedCategory,
          description: prompt.replace(/add expense|spent|paid|bought|expense of|record expense/gi, '').trim() || `${detectedCategory} Expense`,
          notes: prompt,
        }
      } else if (
        pLower.includes('set budget') ||
        pLower.includes('create budget') ||
        pLower.includes('new budget') ||
        pLower.includes('allocate budget') ||
        pLower.includes('budget limit of') ||
        pLower.includes('budget cap')
      ) {
        actionData = {
          type: 'SET_BUDGET',
          amount: amt,
          category: detectedCategory,
        }
      } else if (
        pLower.includes('add goal') ||
        pLower.includes('create goal') ||
        pLower.includes('new goal') ||
        pLower.includes('save for') ||
        pLower.includes('target of')
      ) {
        actionData = {
          type: 'ADD_GOAL',
          amount: amt,
          goal_name: prompt.replace(/add goal|create goal|new goal|save for|target of/gi, '').trim() || 'Savings Goal',
        }
      } else if (
        pLower.includes('add investment') ||
        pLower.includes('invest in') ||
        pLower.includes('invested in') ||
        pLower.includes('buy stock') ||
        pLower.includes('buy shares')
      ) {
        actionData = {
          type: 'ADD_INVESTMENT',
          amount: amt,
          source: detectedCategory === 'Food' ? 'Mutual Funds' : detectedCategory,
          name: prompt.replace(/add investment|invest in|invested in|buy stock|buy shares/gi, '').trim() || 'New Portfolio Holding',
        }
      }
    }
  }

  // Execute Action against React FinanceContext safely
  if (actionData) {
    const actType = actionData.type
    const actAmount = Number(actionData.amount || 0)

    try {
      if (actType === 'ADD_EXPENSE' && actAmount > 0) {
        const cat = actionData.category || 'Food'
        const desc = actionData.description || actionData.notes || `${cat} Transaction`
        const expenseObj = {
          id: 'exp_' + Date.now(),
          description: desc,
          category: cat,
          amount: actAmount,
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'UPI',
          status: 'Completed',
          notes: actionData.notes || prompt,
        }
        if (financeContext?.addExpense) {
          await financeContext.addExpense(expenseObj)
        }
        actionExecuted = {
          type: 'ADD_EXPENSE',
          title: 'Expense Recorded',
          category: cat,
          amount: actAmount,
          badgeColor: 'rose',
          link: '/expenses',
          linkLabel: 'View in Expenses',
          details: `₹${actAmount.toLocaleString('en-IN')} added under ${cat} ("${desc}")`,
        }
        if (!replyText) {
          replyText = `Recorded an expense of **₹${actAmount.toLocaleString('en-IN')}** for **"${desc}"** under category **${cat}**.`
        }
      } else if (actType === 'ADD_INCOME' && actAmount > 0) {
        const source = actionData.source || 'Salary'
        try {
          await userService.updateProfile({ monthlyIncome: actAmount })
        } catch (e) {}
        if (financeContext?.refreshData) {
          try {
            await financeContext.refreshData()
          } catch (e) {}
        }
        actionExecuted = {
          type: 'ADD_INCOME',
          title: 'Income / Salary Updated',
          category: source,
          amount: actAmount,
          badgeColor: 'emerald',
          link: '/profile',
          linkLabel: 'View Profile',
          details: `Monthly Income updated to ₹${actAmount.toLocaleString('en-IN')} (${source})`,
        }
        if (!replyText) {
          replyText = `Updated monthly income to **₹${actAmount.toLocaleString('en-IN')}** from **${source}**.`
        }
      } else if (actType === 'SET_BUDGET' && actAmount > 0) {
        const cat = actionData.category || 'Food'
        const currentBudgets = Array.isArray(financeContext?.budgets) ? financeContext.budgets : []
        const existingBudget = currentBudgets.find((b) => b?.category && b.category.toLowerCase() === cat.toLowerCase())

        if (existingBudget && financeContext?.updateBudget) {
          await financeContext.updateBudget(existingBudget.id, { limit: actAmount })
        } else if (financeContext?.addBudget) {
          await financeContext.addBudget({
            id: 'bud_' + Date.now(),
            name: `${cat} Allowance`,
            category: cat,
            limit: actAmount,
            spent: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
            color: '#3b82f6',
          })
        }
        actionExecuted = {
          type: 'SET_BUDGET',
          title: 'Budget Set',
          category: cat,
          amount: actAmount,
          badgeColor: 'brand',
          link: '/budgets',
          linkLabel: 'View Budgets',
          details: `Monthly budget limit of ₹${actAmount.toLocaleString('en-IN')} set for ${cat}`,
        }
        if (!replyText) {
          replyText = `Established a monthly budget cap of **₹${actAmount.toLocaleString('en-IN')}** for **${cat}**.`
        }
      } else if (actType === 'ADD_GOAL' && actAmount > 0) {
        const gName = actionData.goal_name || 'Savings Milestone'
        const targetDate = new Date()
        targetDate.setFullYear(targetDate.getFullYear() + 1)
        if (financeContext?.addGoal) {
          await financeContext.addGoal({
            id: 'goal_' + Date.now(),
            title: gName,
            targetAmount: actAmount,
            currentAmount: 0,
            targetDate: targetDate.toISOString().split('T')[0],
            category: 'Savings',
            status: 'In Progress',
          })
        }
        actionExecuted = {
          type: 'ADD_GOAL',
          title: 'Goal Created',
          category: gName,
          amount: actAmount,
          badgeColor: 'amber',
          link: '/goals',
          linkLabel: 'View Goals',
          details: `Milestone "${gName}" initialized with target ₹${actAmount.toLocaleString('en-IN')}`,
        }
        if (!replyText) {
          replyText = `Created a new financial goal **"${gName}"** with target of **₹${actAmount.toLocaleString('en-IN')}**.`
        }
      } else if (actType === 'ADD_INVESTMENT' && actAmount > 0) {
        const invType = actionData.source || 'Mutual Funds'
        const invName = actionData.name || `${invType} Investment`
        if (financeContext?.addInvestment) {
          await financeContext.addInvestment({
            id: 'inv_' + Date.now(),
            name: invName,
            type: invType,
            investedAmount: actAmount,
            currentValue: Math.round(actAmount * 1.08),
            purchaseDate: new Date().toISOString().split('T')[0],
            quantity: 1,
            riskLevel: 'Moderate',
            notes: prompt,
          })
        }
        actionExecuted = {
          type: 'ADD_INVESTMENT',
          title: 'Investment Added',
          category: invType,
          amount: actAmount,
          badgeColor: 'emerald',
          link: '/investments',
          linkLabel: 'View Portfolio',
          details: `Holding "${invName}" added with ₹${actAmount.toLocaleString('en-IN')}`,
        }
        if (!replyText) {
          replyText = `Added **₹${actAmount.toLocaleString('en-IN')}** holding into **${invName}** (${invType}).`
        }
      } else if (actType === 'DELETE_ALL_EXPENSES') {
        if (financeContext?.clearAllExpenses) {
          await financeContext.clearAllExpenses()
        }
        actionExecuted = {
          type: 'DELETE_ALL_EXPENSES',
          title: 'Expenses Cleared',
          category: 'Expenses',
          amount: 0,
          badgeColor: 'slate',
          link: '/expenses',
          linkLabel: 'View Expenses',
          details: 'All logged expense records have been cleared.',
        }
        if (!replyText) {
          replyText = `All expense records have been cleared for **${userName}**.`
        }
      } else if (actType === 'DELETE_ALL_BUDGETS') {
        if (financeContext?.clearAllBudgets) {
          await financeContext.clearAllBudgets()
        }
        actionExecuted = {
          type: 'DELETE_ALL_BUDGETS',
          title: 'Budgets Cleared',
          category: 'Budgets',
          amount: 0,
          badgeColor: 'slate',
          link: '/budgets',
          linkLabel: 'View Budgets',
          details: 'All category budget limits have been reset.',
        }
        if (!replyText) {
          replyText = `All category budget limits have been cleared.`
        }
      } else if (actType === 'DELETE_ALL_GOALS') {
        if (financeContext?.clearAllGoals) {
          await financeContext.clearAllGoals()
        }
        actionExecuted = {
          type: 'DELETE_ALL_GOALS',
          title: 'Goals Cleared',
          category: 'Goals',
          amount: 0,
          badgeColor: 'slate',
          link: '/goals',
          linkLabel: 'View Goals',
          details: 'All financial goal targets have been cleared.',
        }
        if (!replyText) {
          replyText = `All financial goals have been cleared.`
        }
      } else if (actType === 'DELETE_ALL_INVESTMENTS') {
        if (financeContext?.clearAllInvestments) {
          await financeContext.clearAllInvestments()
        }
        actionExecuted = {
          type: 'DELETE_ALL_INVESTMENTS',
          title: 'Investments Cleared',
          category: 'Investments',
          amount: 0,
          badgeColor: 'slate',
          link: '/investments',
          linkLabel: 'View Portfolio',
          details: 'All portfolio holdings have been cleared.',
        }
        if (!replyText) {
          replyText = `All portfolio investment holdings have been cleared.`
        }
      } else if (actType === 'RESET_ALL_DATA') {
        if (financeContext?.resetAllFinanceData) {
          await financeContext.resetAllFinanceData()
        }
        actionExecuted = {
          type: 'RESET_ALL_DATA',
          title: 'All Data Reset',
          category: 'Account',
          amount: 0,
          badgeColor: 'rose',
          link: '/dashboard',
          linkLabel: 'View Dashboard',
          details: 'All expenses, budgets, goals, and investments have been reset to 0.',
        }
        if (!replyText) {
          replyText = `All your finance records (expenses, budgets, goals, investments) have been reset to 0.`
        }
      }
    } catch (actErr) {
      console.error('Failed to execute AI action safely:', actErr)
    }
  }

  // If Gemini produced no text response, check local query engine
  if (!replyText) {
    const localRes = handleLocalQueryAndIntent({ prompt, user, financeContext })
    if (localRes && localRes.reply) {
      replyText = localRes.reply
    }
  }

  // Fallback conversational responses if still empty
  if (!replyText) {
    const userIncome = Number(user?.monthlyIncome || financeContext?.metrics?.totalIncome || 0)
    const totExp = Number(financeContext?.metrics?.totalExpenses || 0)
    const totSav = Number(financeContext?.metrics?.totalSavings || Math.max(0, userIncome - totExp))
    const totInv = Number(financeContext?.metrics?.totalInvested || 0)
    const hScore = financeContext?.metrics?.healthScore || 78

    replyText = `Hello **${userName}**! 👋 Here is your live financial snapshot:\n\n` +
      `• **Monthly Income:** ₹${userIncome.toLocaleString('en-IN')}\n` +
      `• **Total Expenses:** ₹${totExp.toLocaleString('en-IN')}\n` +
      `• **Net Savings:** ₹${totSav.toLocaleString('en-IN')}\n` +
      `• **Investments:** ₹${totInv.toLocaleString('en-IN')}\n` +
      `• **Health Score:** ${hScore}/100\n\n` +
      `You can ask me about your previous transactions, exceeded budgets, investment returns, or tell me to log an expense in English, Telugu, or Hindi!`
  }

  return {
    reply: replyText,
    action: actionExecuted,
    poweredBy,
  }
}
