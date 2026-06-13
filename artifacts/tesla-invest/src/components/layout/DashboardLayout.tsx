import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuth } from '../../context/AuthContext'
import { NotificationProvider, useNotifications } from '../../context/NotificationContext'
import { usePriceAlertWatcher, type FiredAlert } from '../../hooks/usePriceAlertWatcher'
import { AlertNotificationStack } from '../ui/AlertNotification'

function DashboardInner() {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const [firedAlerts, setFiredAlerts] = useState<FiredAlert[]>([])

  const handleFired = useCallback((alert: FiredAlert) => {
    addNotification(alert)
    setFiredAlerts((prev) => {
      const deduped = prev.filter((a) => a.id !== alert.id)
      return [...deduped, alert].slice(-4)
    })
  }, [addNotification])

  const handleDismiss = useCallback((id: string) => {
    setFiredAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  usePriceAlertWatcher(currentUser?.uid, handleFired)

  return (
    <div className="flex bg-navy-base min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 py-8 px-8 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AlertNotificationStack alerts={firedAlerts} onDismiss={handleDismiss} />
    </div>
  )
}

export function DashboardLayout() {
  return (
    <NotificationProvider>
      <DashboardInner />
    </NotificationProvider>
  )
}
