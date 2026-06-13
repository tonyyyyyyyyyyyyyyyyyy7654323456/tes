import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, TrendingUp, TrendingDown, Trash2, X } from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface Props {
  open: boolean
  onClose: () => void
}

export function NotificationPanel({ open, onClose }: Props) {
  const { history, unreadCount, markAllRead, clearAll } = useNotifications()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) markAllRead()
  }, [open, markAllRead])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="absolute top-full right-0 mt-2 w-96 bg-navy-card border border-white/[0.1] rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-white">Alert History</span>
              {unreadCount > 0 && (
                <span className="bg-accent text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-white/30 hover:text-white/70 transition text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
              <button onClick={onClose} className="text-white/30 hover:text-white/70 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto scrollbar-none">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-raised flex items-center justify-center">
                  <BellOff className="w-5 h-5 text-white/20" />
                </div>
                <p className="text-white/30 text-sm">No alerts fired yet</p>
                <p className="text-white/20 text-xs text-center max-w-[200px]">
                  Set price alerts in Market Detail pages to get notified here
                </p>
              </div>
            ) : (
              history.map((n) => {
                const isAbove = n.type === 'above'
                return (
                  <Link
                    key={`${n.id}-${n.firedAt}`}
                    to={`/markets/${n.symbol}`}
                    onClick={onClose}
                    className={`flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-navy-raised/50 transition ${
                      !n.read ? 'bg-accent/[0.03]' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${
                      isAbove ? 'bg-gain/15' : 'bg-loss/15'
                    }`}>
                      {isAbove
                        ? <TrendingUp className="w-3.5 h-3.5 text-gain" />
                        : <TrendingDown className="w-3.5 h-3.5 text-loss" />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-white font-medium">
                          {n.symbol}
                          <span className={`ml-1.5 text-xs font-normal ${isAbove ? 'text-gain' : 'text-loss'}`}>
                            {isAbove ? '↑ above' : '↓ below'} ${fmt(n.targetPrice)}
                          </span>
                        </p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">
                        Hit <span className="text-white/60 num">${fmt(n.currentPrice)}</span>
                        <span className="mx-1.5">·</span>
                        {timeAgo(n.firedAt)}
                      </p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* Footer hint */}
          {history.length > 0 && (
            <div className="px-5 py-3 border-t border-white/[0.07]">
              <p className="text-xs text-white/25 text-center">
                Showing {history.length} fired alert{history.length !== 1 ? 's' : ''} this session
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
