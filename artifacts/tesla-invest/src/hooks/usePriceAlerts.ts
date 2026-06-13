import { useState, useEffect } from 'react'
import { onPriceAlerts, addPriceAlert, removePriceAlert } from '../lib/firestore'
import type { PriceAlert } from '../types'

export function usePriceAlerts(uid: string | undefined, symbol?: string) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])

  useEffect(() => {
    if (!uid) return
    return onPriceAlerts(uid, (all) => {
      setAlerts(symbol ? all.filter((a) => a.symbol === symbol) : all)
    })
  }, [uid, symbol])

  const addAlert = async (sym: string, type: 'above' | 'below', targetPrice: number) => {
    if (!uid) return
    await addPriceAlert(uid, sym, type, targetPrice)
  }

  const removeAlert = async (alertId: string) => {
    if (!uid) return
    await removePriceAlert(uid, alertId)
  }

  return { alerts, addAlert, removeAlert }
}
