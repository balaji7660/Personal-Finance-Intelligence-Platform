import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  PieChart,
  Target,
  Activity,
  Receipt,
  CheckCircle2,
  Lock,
  Zap,
  BarChart3,
  Sun,
  Moon,
  ChevronRight,
  Star,
  Users,
  Smartphone,
  Wallet,
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/common/Button'

export const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const features = [
    {
      icon: Receipt,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900',
      title: 'Smart Expense Tracking',
      description: 'Log and categorize daily UPI, Credit Card, and cash outlays with search, filters, and audit logs.',
    },
    {
      icon: PieChart,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
      title: 'Active Budget Guardrails',
      description: 'Set monthly limits per category with real-time progress bars and 80% overspending alert banners.',
    },
    {
      icon: TrendingUp,
      color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-900',
      title: 'Multi-Asset Portfolio',
      description: 'Track Mutual Funds, Direct Equities, Gold ETFs, RBI Bonds, and SGBs with automated P&L & alpha.',
    },
    {
      icon: Target,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
      title: 'Milestone Goal Planner',
      description: 'Formulate time-bound savings goals with required monthly contributions and deposit progress tracking.',
    },
    {
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900',
      title: '100-Pt Health Diagnostic',
      description: 'Comprehensive financial health scores across Savings, Budgeting, Investment mix, and Debt ratios.',
    },
    {
      icon: BarChart3,
      color: 'text-brand-500 bg-brand-50 dark:bg-brand-950/40 border-brand-200 dark:border-brand-900',
      title: 'Audit-Ready Reports',
      description: 'Generate master balance sheets, expense audit logs, and investment statements with 1-click CSV & PDF export.',
    },
  ]

  const stats = [
    { label: 'Tracking Accuracy', value: '100%' },
    { label: 'Built for India', value: 'INR (₹)' },
    { label: 'Security Standard', value: '256-Bit 2FA' },
    { label: 'User Satisfaction', value: '4.9 / 5.0' },
  ]

  const testimonials = [
    {
      name: 'Rohan Deshmukh',
      role: 'Staff Software Architect, Bangalore',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      content: 'FinSight completely transformed how I manage my monthly salary and equity SIPs. The health score breakdown and budget warning alerts keep my savings rate above 40% consistently.',
    },
    {
      name: 'Ananya Singhania',
      role: 'Product Lead, Mumbai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      content: 'The multi-asset portfolio tracker supports Indian sovereign gold bonds and mutual funds seamlessly. The printable financial report feature is fantastic for annual tax filing.',
    },
    {
      name: 'Karthik Iyer',
      role: 'Management Consultant, Hyderabad',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      content: 'Clean, elegant, and blazing fast. No bloated animations or confusing gimmicks — just pure, actionable financial intelligence with native Indian Rupee formatting.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-black text-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
              FinSight
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#analytics" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Intelligence
            </a>
            <a href="#security" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Security
            </a>
            <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Reviews
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex text-xs font-semibold px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white"
            >
              Sign In
            </Link>

            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/dashboard')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 text-xs font-semibold mb-6 shadow-xs animate-bounce-short">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Next-Gen Personal Finance Intelligence Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Master Your Money.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">
              Accelerate Your Wealth.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one financial dashboard engineered for high-growth individuals. Track daily expenses, automate smart budget caps, monitor mutual funds & stocks, and unlock AI health scores — in Indian Rupee (₹).
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full sm:w-auto shadow-lg shadow-brand-600/25 px-8"
            >
              Explore Live Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8"
            >
              Create Free Account
            </Button>
          </div>

          {/* Stats Ribbon */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs text-center"
              >
                <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Floating UI Preview Card */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/5 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-md">
              <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 text-left space-y-6">
                {/* Mock header bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        FinSight Executive Overview
                      </h3>
                      <p className="text-xs text-slate-500">Live Snapshot • Monthly Savings Rate 43.3%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      Health Score: 78/100
                    </span>
                  </div>
                </div>

                {/* Mock stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Income</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₹75,000</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">+4.2% verified</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Expenses</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₹42,500</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Within 72% budget</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Total Savings</span>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">₹32,500</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">+12% vs last month</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">Portfolio Value</span>
                    <p className="text-xl font-bold text-violet-600 dark:text-violet-400 mt-1">₹2,45,000</p>
                    <span className="text-[10px] text-violet-600 font-semibold">+14.8% all-time</span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Launch Interactive Dashboard View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Complete Financial Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Everything You Need to Scale Your Net Worth
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Modular architecture built from ground up to manage Indian household and personal wealth flows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-400 dark:hover:border-brand-600 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-5 ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. FINANCIAL INTELLIGENCE DEEP-DIVE */}
      <section id="analytics" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Behavioral Insights
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2 leading-tight">
                AI Recommendations That Put Money Back in Your Pocket
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
                FinSight doesn't just log past transactions — it acts as your personal financial copilot. It spots category spending inflation, aligns your budget with the 50/30/20 rule, and recommends optimal SIP asset allocations.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Inflation & Drift Detection</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Instant alerts when discretionary dining or retail expenses jump month-on-month.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Portfolio Alpha Diagnostics</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Benchmarked directly against Nifty 50 with beta volatility calculation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Printable Tax & Audit Statements</h4>
                    <p className="text-xs text-slate-500 mt-0.5">One-click CSV exports and printable master balance sheets for CA audit and tax filing.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/analytics')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  View Intelligence Hub
                </Button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 text-white shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-xs uppercase font-bold text-brand-300">Composite Health Score</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-white">Grade A</span>
              </div>

              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <span className="text-5xl font-black text-white">78</span>
                  <span className="text-base text-slate-400 block mt-1 font-medium">out of 100</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Savings Rate (43.3%)</span>
                    <span className="text-emerald-400">80% Score</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-emerald-400 h-2 rounded-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Investments Diversification</span>
                    <span className="text-violet-400">82% Score</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-violet-400 h-2 rounded-full w-[82%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Budget Discipline</span>
                    <span className="text-amber-400">75% Score</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              Trusted by Professionals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
              Loved by Engineers, Consultants & Wealth Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-brand-200 dark:border-brand-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to Take Total Control of Your Financial Future?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Join thousands of disciplined savers and investors. Get immediate access to your FinSight intelligence dashboard with zero setup fees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto px-8 bg-brand-500 hover:bg-brand-600"
                >
                  Create Free Account
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-8 bg-white/10 hover:bg-white/20 text-white border-transparent"
                >
                  View Live Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer id="security" className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white font-black text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              FinSight
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
              Dashboard
            </Link>
            <Link to="/expenses" className="hover:text-brand-600 dark:hover:text-brand-400">
              Expenses
            </Link>
            <Link to="/budgets" className="hover:text-brand-600 dark:hover:text-brand-400">
              Budgets
            </Link>
            <Link to="/investments" className="hover:text-brand-600 dark:hover:text-brand-400">
              Investments
            </Link>
            <Link to="/goals" className="hover:text-brand-600 dark:hover:text-brand-400">
              Goals
            </Link>
            <Link to="/reports" className="hover:text-brand-600 dark:hover:text-brand-400">
              Reports
            </Link>
          </div>

          <p>© {new Date().getFullYear()} FinSight Financial Technologies. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
