import React, { useState, useEffect, useRef, Component } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Key,
  Trash2,
  TrendingUp,
  Receipt,
  PieChart,
  Target,
  ShieldCheck,
  Zap,
  ArrowRight,
  Bot,
  User,
  Copy,
  Check,
  CheckCircle2,
  CornerDownLeft,
  Activity,
  Coins,
  Globe,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import {
  processAiMessage,
  getGeminiApiKey,
  saveGeminiApiKey,
} from '../../services/geminiAiService'

import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'

// Error Boundary to prevent any blank screen crashes
class ChatErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat rendering error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50 my-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Something unexpected occurred in the AI Assistant
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            We recovered safely. Click the button below to clear chat cache and restore the Assistant.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              localStorage.removeItem('finsight_chat_history')
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Reset Chat & Reload
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}

const SUGGESTED_PROMPTS = [
  {
    label: 'Profile & Account Details',
    prompt: 'Show my verified profile details, monthly income, and risk preference',
    icon: User,
    color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30',
  },
  {
    label: 'Which budgets exceed 80%?',
    prompt: 'Which category budgets are currently exceeding 80% utilization or at risk?',
    icon: PieChart,
    color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/30',
  },
  {
    label: 'Previous logged Food & Swiggy expenses',
    prompt: 'What are my previously logged expenses for Food, Dining, and Swiggy?',
    icon: Receipt,
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30',
  },
  {
    label: 'Investment portfolio & returns',
    prompt: 'Show my investment portfolio holdings and total returns',
    icon: TrendingUp,
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  },
  {
    label: 'Add Expense: ₹1,850 Swiggy Dinner',
    prompt: 'Add an expense of ₹1,850 for Swiggy Gourmet Dinner under Food',
    icon: Receipt,
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30',
  },
  {
    label: 'Telugu: నా ప్రొఫైల్ మరియు ఖర్చులు చెప్పు',
    prompt: 'Namaste! Naa monthly salary, location, mariyu logged expenses details cheppu',
    icon: Globe,
    color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/30',
  },
]

export const AiAssistantInner = () => {
  const { user } = useAuth()
  const financeContext = useFinance()
  const navigate = useNavigate()

  const userName = (user?.name || user?.username || 'User').trim()
  const userRole = user?.occupation ? ` (${user.occupation})` : ''
  const userIncome = Number(user?.monthlyIncome || financeContext?.metrics?.totalIncome || 0)

  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('finsight_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch (e) {
      console.warn('Failed parsing chat history:', e)
    }
    return [
      {
        id: 'welcome-1',
        sender: 'assistant',
        text: `Hello **${userName}**${userRole}! 👋 I am your **FinSight Gemini AI Copilot**.\n\nI have synced your live profile and verified history:\n• **Monthly Income:** ₹${userIncome.toLocaleString('en-IN')}\n• **Location:** ${user?.location || 'Not set'}\n• **Financial Health Score:** ${financeContext?.metrics?.healthScore || 78}/100\n• **Investments:** ₹${(financeContext?.metrics?.totalInvested || 0).toLocaleString('en-IN')}\n\nYou can ask me about your previous transactions, exceeded budgets, or command me to log new expenses in **English**, **Telugu**, or **Hindi**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'Google Gemini AI 🤖',
      },
    ]
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(() => getGeminiApiKey())
  const [copiedId, setCopiedId] = useState(null)

  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  // Save chat history safely
  useEffect(() => {
    try {
      if (Array.isArray(messages)) {
        localStorage.setItem('finsight_chat_history', JSON.stringify(messages))
      }
    } catch (e) {
      console.warn('Could not save chat history to localStorage:', e)
    }
  }, [messages])

  // Scroll to bottom on new messages safely
  useEffect(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (e) {
      // ignore
    }
  }, [messages, isProcessing])

  // Speech Recognition Setup safely
  useEffect(() => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = 'en-IN'

        recognition.onresult = (event) => {
          if (event.results && event.results[0] && event.results[0][0]) {
            const transcript = event.results[0][0].transcript
            setInputMessage(transcript)
          }
          setIsListening(false)
        }

        recognition.onerror = () => setIsListening(false)
        recognition.onend = () => setIsListening(false)

        recognitionRef.current = recognition
      }
    } catch (e) {
      console.warn('Speech recognition setup skipped:', e)
    }
  }, [])

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      financeContext?.showToast?.('Voice recognition not supported in this browser.', 'error')
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
      } catch (e) {}
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        console.error('Speech recognition error:', err)
        setIsListening(false)
      }
    }
  }

  const handleSendMessage = async (textToSend = null) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputMessage || '').trim()
    if (!text || isProcessing) return

    const userMsgId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4)
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...(Array.isArray(prev) ? prev : []), userMsg])
    setInputMessage('')
    setIsProcessing(true)

    try {
      const response = await processAiMessage({
        prompt: text,
        user: user || {},
        financeContext: financeContext || {},
        customApiKey: apiKeyInput,
      })

      const botReply = response?.reply || `I have processed your request: "${text}"`
      const botMsg = {
        id: 'bot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        sender: 'assistant',
        text: botReply,
        action: response?.action || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: response?.poweredBy || 'FinSight Financial Engine ⚡',
      }

      setMessages((prev) => [...(Array.isArray(prev) ? prev : []), botMsg])
    } catch (error) {
      console.error('Error processing AI prompt:', error)
      setMessages((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        {
          id: 'bot-err-' + Date.now(),
          sender: 'assistant',
          text: `I received your command: **"${text}"**. Please feel free to ask any financial question or record an expense!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          poweredBy: 'FinSight Engine',
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearHistory = () => {
    const welcome = [
      {
        id: 'welcome-init',
        sender: 'assistant',
        text: `Chat cleared! Ready for your financial commands, **${userName}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'Google Gemini AI 🤖',
      },
    ]
    setMessages(welcome)
    try {
      localStorage.removeItem('finsight_chat_history')
    } catch (e) {}
  }

  const handleSaveKey = () => {
    saveGeminiApiKey(apiKeyInput)
    setIsKeyModalOpen(false)
    financeContext?.showToast?.('Gemini API Key updated successfully!')
  }

  const copyToClipboard = (text, id) => {
    if (!text) return
    try {
      navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (e) {
      console.warn('Copy failed:', e)
    }
  }

  // Safe markdown helper
  const renderFormattedText = (text) => {
    if (!text) return null
    const str = typeof text === 'string' ? text : String(text)

    try {
      const lines = str.split('\n')
      return (
        <div className="space-y-1.5 leading-relaxed text-sm">
          {lines.map((line, idx) => {
            if (!line || !line.trim()) {
              return <div key={idx} className="h-1" />
            }

            const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('* ')
            const cleanLine = isBullet ? line.replace(/^[\s•\-\*]+/, '').trim() : line

            const parts = cleanLine.split(/(\*\*.*?\*\*)/g)

            return (
              <div
                key={idx}
                className={`${isBullet ? 'flex items-start gap-2 pl-2' : ''}`}
              >
                {isBullet && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                )}
                <span>
                  {parts.map((p, pIdx) => {
                    if (p && p.startsWith('**') && p.endsWith('**') && p.length > 4) {
                      return (
                        <strong
                          key={pIdx}
                          className="font-semibold text-slate-900 dark:text-white"
                        >
                          {p.slice(2, -2)}
                        </strong>
                      )
                    }
                    return <span key={pIdx}>{p}</span>
                  })}
                </span>
              </div>
            )
          })}
        </div>
      )
    } catch (err) {
      return <p className="text-sm">{str}</p>
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
      {/* Header */}
      <PageHeader
        title="Gemini AI Assistant & Copilot"
        subtitle="Conversational financial assistant powered by Google Gemini with live portfolio action triggers"
        badge="Gemini 2.5 Flash"
        breadcrumbs={['Dashboard', 'AI Assistant']}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsKeyModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Key className="w-4 h-4 text-brand-500" />
            <span>API Key</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </PageHeader>

      {/* Live Financial Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 bg-white/70 dark:bg-slate-900/70 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs flex-shrink-0">
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Income</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatCurrency(financeContext?.metrics?.totalIncome || userIncome || 75000)}
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Expenses</span>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(financeContext?.metrics?.totalExpenses || 0)}
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Net Savings</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(financeContext?.metrics?.totalSavings || 0)}
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Investments</span>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
            {formatCurrency(financeContext?.metrics?.totalInvested || 0)}
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Health Score</span>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
            {financeContext?.metrics?.healthScore || 78}/100
          </span>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold">Live Sync</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 opacity-80" />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {Array.isArray(messages) && messages.map((msg, msgIndex) => {
            if (!msg) return null
            const isUser = msg.sender === 'user'
            const msgKey = msg.id || `msg-${msgIndex}`

            return (
              <div
                key={msgKey}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                    isUser
                      ? 'bg-slate-800 dark:bg-slate-700'
                      : 'bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-600 shadow-brand-500/20'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className="space-y-2 max-w-xl">
                  <div
                    className={`p-4 rounded-2xl text-sm relative group transition-all ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-xs shadow-md shadow-brand-600/10'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Action Execution Card */}
                    {msg.action && (
                      <div className="mt-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {msg.action.title || 'Action Completed'}
                            </span>
                          </div>
                          {Number(msg.action.amount || 0) > 0 && (
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(msg.action.amount)}
                            </span>
                          )}
                        </div>

                        {msg.action.details && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                            {msg.action.details}
                          </p>
                        )}

                        {msg.action.link && (
                          <Link
                            to={msg.action.link}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <span>{msg.action.linkLabel || 'View details'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Footer metadata */}
                    <div
                      className={`flex items-center justify-between mt-2 pt-1 border-t text-[10px] ${
                        isUser
                          ? 'border-brand-500/30 text-brand-100'
                          : 'border-slate-200/40 dark:border-slate-700/40 text-slate-400'
                      }`}
                    >
                      <span>{msg.timestamp || ''}</span>
                      {!isUser && msg.poweredBy && (
                        <span className="font-medium text-[9px] opacity-80">
                          {msg.poweredBy}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Copy Button */}
                  {!isUser && msg.text && (
                    <div className="flex items-center gap-2 pl-1">
                      <button
                        onClick={() => copyToClipboard(msg.text, msgKey)}
                        className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msgKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-500">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isProcessing && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 via-indigo-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                    Gemini AI is processing & executing actions...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-slate-900/50 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Quick:
            </span>
            {SUGGESTED_PROMPTS.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-xs transition-all disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-brand-500" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop Listening' : 'Voice Command (English/Telugu/Hindi)'}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Input field */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={
                  isListening
                    ? 'Listening to your speech...'
                    : 'Ask or command AI (e.g. "Add ₹1,200 Uber expense", "Set Food budget ₹8k", "Telugu lo matladu")...'
                }
                disabled={isProcessing}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all disabled:opacity-50 pr-10"
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!inputMessage.trim() || isProcessing}
              className="rounded-xl px-4 py-2.5 flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* API Key Modal */}
      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        title="Google Gemini API Configuration"
        subtitle="Configure your own Google Gemini API key or use the built-in default engine."
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            FinSight connects to Google Gemini models (<code>gemini-2.5-flash</code>, <code>gemini-2.0-flash</code>, <code>gemini-1.5-flash</code>) to execute real-time natural language commands and financial analysis.
          </p>

          <Input
            label="Google Gemini API Key"
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy... / AQ.Ab8RN..."
            helperText="Keys are stored securely in your local browser storage."
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setApiKeyInput('')}
              className="text-xs text-rose-500 hover:underline"
            >
              Reset to Default Key
            </button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsKeyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveKey}
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export const AiAssistant = () => {
  return (
    <ChatErrorBoundary>
      <AiAssistantInner />
    </ChatErrorBoundary>
  )
}

export default AiAssistant
