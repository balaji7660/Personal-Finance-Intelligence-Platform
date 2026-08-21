import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import Navbar from './Navbar'
import Toast from '../common/Toast'
import { useFinance } from '../../hooks/useFinance'

export const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toastMessage } = useFinance()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* Desktop Fixed Left Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
        />
      )}
    </div>
  )
}

export default DashboardLayout
