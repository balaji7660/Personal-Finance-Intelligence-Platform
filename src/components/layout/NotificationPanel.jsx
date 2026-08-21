import React, { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatDateTime } from '../../utils/dateUtils'

export const NotificationPanel = ({ onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useFinance()
  const panelRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const iconMap = {
    warning: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    success: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    info: { icon: Info, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  }

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No notifications available.
          </div>
        ) : (
          notifications.map((notif) => {
            const conf = iconMap[notif.type] || iconMap.info
            const Icon = conf.icon

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationAsRead(notif.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                  !notif.read ? 'bg-brand-50/20 dark:bg-brand-950/20' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${conf.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-semibold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {formatDateTime(notif.timestamp)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteNotification(notif.id)
                  }}
                  className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })
        )}
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
        >
          View all notifications <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

export default NotificationPanel
