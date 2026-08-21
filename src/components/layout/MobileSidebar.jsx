import React from 'react'
import { X } from 'lucide-react'
import Sidebar from './Sidebar'

export const MobileSidebar = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 flex max-w-full z-50">
        <div className="relative w-screen max-w-xs bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Sidebar onItemClick={onClose} className="h-full border-none w-full" />
        </div>
      </div>
    </div>
  )
}

export default MobileSidebar
