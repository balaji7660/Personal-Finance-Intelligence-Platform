import React, { useState } from 'react'
import {
  Bell,
  CheckCheck,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatDateTime } from '../../utils/dateUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'

export const Notifications = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useFinance()

  const [filter, setFilter] = useState('All')

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'All') return true
    if (filter === 'Unread') return !n.read
    if (filter === 'Alerts') return n.type === 'warning'
    if (filter === 'Milestones') return n.type === 'success'
    return true
  })

  const iconMap = {
    warning: { icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' },
    success: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    info: { icon: Info, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Activity Center"
        subtitle="Real-time alerts on budget thresholds, savings milestones, and portfolio growth"
        breadcrumbs={['Dashboard', 'Notifications']}
      >
        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={markAllNotificationsAsRead}
          >
            Mark All Read
          </Button>
        )}
      </PageHeader>

      <DashboardCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <FilterBar
            options={['All', 'Unread', 'Alerts', 'Milestones']}
            activeValue={filter}
            onChange={setFilter}
          />
          <span className="text-xs text-slate-400 font-medium">
            {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
          </span>
        </div>

        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No Notifications"
            description="You are all caught up! No notifications to display."
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const conf = iconMap[notif.type] || iconMap.info
              const Icon = conf.icon

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                    !notif.read
                      ? 'bg-brand-50/20 dark:bg-brand-950/20 border-brand-200 dark:border-brand-900/40 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${conf.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-sm font-semibold ${
                            !notif.read
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-brand-600 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        {formatDateTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notif.id)
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </DashboardCard>
    </div>
  )
}

export default Notifications
