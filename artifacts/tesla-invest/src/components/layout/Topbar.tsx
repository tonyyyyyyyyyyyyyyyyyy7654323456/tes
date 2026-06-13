import { useLocation } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useBalance } from '../../hooks/useBalance'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/markets': 'Markets',
  '/wallet': 'Wallet',
  '/portfolio': 'Portfolio',
  '/profile': 'Profile',
  '/admin': 'Admin Overview',
  '/admin/users': 'Users',
  '/admin/transactions': 'Transactions',
}

export function Topbar() {
  const { currentUser, userDoc } = useAuth()
  const location = useLocation()
  const balance = useBalance(currentUser?.uid)

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
