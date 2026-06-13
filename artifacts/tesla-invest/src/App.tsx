import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Markets } from './pages/Markets'
import { MarketDetail } from './pages/MarketDetail'
import { Wallet } from './pages/Wallet'
import { Portfolio } from './pages/Portfolio'
import { Profile } from './pages/Profile'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminUserDetail } from './pages/admin/AdminUserDetail'
import { AdminTransactions } from './pages/admin/AdminTransactions'

function LoadingScreen({ bg = 'bg-navy-base' }: { bg?: string }) {
  return (
    <div className={`min-h-screen ${bg} flex items-center justify-center`}>
      <Loader2 className="animate-spin text-accent w-8 h-8" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading, role } = useAuth()
  if (loading) return <LoadingScreen />
  if (!currentUser) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth()
  if (loading) return <LoadingScreen bg="bg-[#F8F9FC]" />
  if (currentUser) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/markets/:symbol" element={<MarketDetail />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:uid" element={<AdminUserDetail />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
