import { useMatch, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Users, CreditCard, LogOut } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { Logo } from '../ui/Logo'
import { usePendingCount } from '../../hooks/usePendingCount'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { to: '/admin/users', icon: Users, label: 'Users', exact: false },
  { to: '/admin/transactions', icon: CreditCard, label: 'Transactions', exact: false },
]

function NavItem({
  to,
  icon: Icon,
  label,
  exact,
  badge,
}: {
  to: string
  icon: React.FC<{ className?: string }>
  label: string
  exact: boolean
  badge?: number
}) {
  const matchExact = useMatch(to)
  const matchNested = useMatch(to + '/*')
  const active = exact ? !!matchExact : !!(matchExact || matchNested)

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-3 text-sm transition ${
        active
          ? 'bg-accent/10 text-accent font-medium'
          : 'text-white/50 hover:text-white hover:bg-navy-raised'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-loss text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const { currentUser, userDoc } = useAuth()
  const navigate = useNavigate()
  const pendingCount = usePendingCount()

  const initials = (userDoc?.name || currentUser?.displayName || 'A').slice(0, 2).toUpperCase()

  async function handleLogout() {
    await signOut(auth)
    navigate('/login')
  }

  return (
    <div className="w-56 bg-navy-sidebar border-r border-white/[0.07] flex flex-col h-screen fixed left-0 top-0 z-30">
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Logo size="sm" />
        <p className="text-[10px] tracking-[0.2em] text-accent/60 uppercase mt-3">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            {...item}
            badge={item.to === '/admin/transactions' ? pendingCount : undefined}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate">{userDoc?.name || 'Admin'}</p>
            <p className="text-xs text-white/40 truncate">{currentUser?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/70 transition w-full"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </button>
      </div>
    </div>
  )
}
