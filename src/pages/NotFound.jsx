import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950">
      <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black text-3xl mb-4 shadow-lg shadow-brand-500/10">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The financial dashboard route you requested does not exist or may have been moved.
      </p>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="md"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          size="md"
          icon={Home}
          onClick={() => navigate('/dashboard')}
        >
          Dashboard Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound
