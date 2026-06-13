import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Wallet, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBalance } from '../../hooks/useBalance'
import { useNotifications } from '../../context/NotificationContext'
import { NotificationPanel } from '../ui/NotificationPanel'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/markets': 'Markets',
  '/wallet': 'Wallet',
  '/portfolio': 'Portfolio',
  '/profile': 'Profile',
  '/admin': 'Admin Overview',
  '/admin/users': 'Users',
  '/admin/transactions': 'Transactions',
  '/admin/config': 'Configuration',
}

export function Topbar() {
  const { currentUser, userDoc } = useAuth()
  const location = useLocation()
  const balance = useBalance(currentUser?.uid)
  const { unreadCount } = useNotifications()
  const [panelOpen, setPanelOpen] = useState(false)
  const bellRef = useRef<HTMLDivElement>(null)

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith('/markets/') ? 'Market Detail' : '') ||
    (location.pathname.startsWith('/admin/users/') ? 'User Detail' : 'Dashboard')

  const initials = (userDoc?.name || currentUser?.displayName || currentUser?.email || 'U')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="h-16 bg-navy-card/80 backdrop-blur-md border-b border-white/[0.07] flex items-center justify-between px-8 sticky top-0 z-20">
      <h1 className="text-white font-medium text-sm tracking-tight">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="bg-navy-raised border border-white/[0.07] rounded-full px-4 py-1.5 text-sm flex items-center gap-2">
          <Wallet className="w-3.5 h-3.5 text-white/40" />
          <span className="text-white num">
            ${balance.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Bell button */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition ${
              panelOpen
                ? 'bg-accent/20 text-accent'
                : 'bg-navy-raised border border-white/[0.07] text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        </div>

        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}
