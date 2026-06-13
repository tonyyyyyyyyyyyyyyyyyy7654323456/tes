import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FiredAlert } from '../../hooks/usePriceAlertWatcher'

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

interface Props {
  alert: FiredAlert
  onDismiss: (id: string) => void
}

export function AlertNotification({ alert, onDismiss }: Props) {
  const isAbove = alert.type === 'above'

  useEffect(() => {
    const t = setTimeout(() => onDismiss(alert.id), 8000)
    return () => clearTimeout(t)
  }, [alert.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`relative flex items-start gap-3 rounded-2xl p-4 shadow-2xl shadow-black/40 border backdrop-blur-sm w-80 ${
        isAbove
          ? 'bg-gain/10 border-gain/30'
          : 'bg-loss/10 border-loss/30'
      }`}
    >
      {/* Animated glow pulse */}
      <div className={`absolute inset-0 rounded-2xl pointer-events-none animate-pulse ${
        isAbove ? 'bg-gain/5' : 'bg-loss/5'
      }`} />

      {/* Icon */}
      <div className={`relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
        isAbove ? 'bg-gain/20' : 'bg-loss/20'
      }`}>
        {isAbove
          ? <TrendingUp className="w-4 h-4 text-gain" />
          : <TrendingDown className="w-4 h-4 text-loss" />
        }
        <span className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
          isAbove ? 'bg-gain' : 'bg-loss'
        }`}>
          <Bell className="w-2 h-2 text-navy-base" />
        </span>
      </div>

      {/* Content */}
      <div className="relative flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-white text-sm font-medium leading-tight">
              Price Alert: <span className="font-bold">{alert.symbol}</span>
            </p>
            <p className={`text-xs mt-0.5 font-medium ${isAbove ? 'text-gain' : 'text-loss'}`}>
              {isAbove ? '↑ Crossed above' : '↓ Dropped below'} ${fmt(alert.targetPrice)}
            </p>
          </div>
          <button
            onClick={() => onDismiss(alert.id)}
            className="text-white/30 hover:text-white/70 transition flex-shrink-0 mt-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span>Target: <span className="text-white/70 num">${fmt(alert.targetPrice)}</span></span>
            <span className="text-white/20">·</span>
            <span>Now: <span className={`num font-medium ${isAbove ? 'text-gain' : 'text-loss'}`}>${fmt(alert.currentPrice)}</span></span>
          </div>
          <Link
            to={`/markets/${alert.symbol}`}
            className={`flex items-center gap-1 text-xs font-medium transition ${
              isAbove ? 'text-gain hover:text-gain/80' : 'text-loss hover:text-loss/80'
            }`}
          >
            Trade <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Progress bar (auto-dismiss countdown) */}
      <motion.div
        className={`absolute bottom-0 left-0 h-0.5 rounded-full ${isAbove ? 'bg-gain' : 'bg-loss'}`}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 8, ease: 'linear' }}
      />
    </motion.div>
  )
}

interface AlertStackProps {
  alerts: FiredAlert[]
  onDismiss: (id: string) => void
}

export function AlertNotificationStack({ alerts, onDismiss }: AlertStackProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence mode="sync">
        {alerts.map((a) => (
          <div key={a.id} className="pointer-events-auto">
            <AlertNotification alert={a} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
