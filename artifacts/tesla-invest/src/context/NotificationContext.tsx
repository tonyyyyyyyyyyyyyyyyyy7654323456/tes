import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { FiredAlert } from '../hooks/usePriceAlertWatcher'

interface NotificationEntry extends FiredAlert {
  read: boolean
}

interface NotificationContextValue {
  history: NotificationEntry[]
  unreadCount: number
  addNotification: (alert: FiredAlert) => void
  markAllRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<NotificationEntry[]>([])

  const addNotification = useCallback((alert: FiredAlert) => {
    setHistory((prev) => {
      const deduped = prev.filter((n) => n.id !== alert.id)
      return [{ ...alert, read: false }, ...deduped].slice(0, 50)
    })
  }, [])

  const markAllRead = useCallback(() => {
    setHistory((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setHistory([])
  }, [])

  const unreadCount = history.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ history, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
