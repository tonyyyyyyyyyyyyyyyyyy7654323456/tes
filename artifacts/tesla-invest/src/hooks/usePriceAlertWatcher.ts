import { useEffect, useRef, useCallback } from 'react'
import { onAssets, onPriceAlerts, deactivatePriceAlert } from '../lib/firestore'
import type { PriceAlert, Asset } from '../types'

export interface FiredAlert {
  id: string
  symbol: string
  assetName: string
  type: 'above' | 'below'
  targetPrice: number
  currentPrice: number
  firedAt: number
}

export function usePriceAlertWatcher(
  uid: string | undefined,
  onFired: (alert: FiredAlert) => void,
) {
  const pricesRef = useRef<Record<string, number>>({})
  const alertsRef = useRef<PriceAlert[]>([])
  const assetsRef = useRef<Record<string, Asset>>({})
  const firedIds = useRef<Set<string>>(new Set())
  const onFiredRef = useRef(onFired)
  onFiredRef.current = onFired

  const check = useCallback(() => {
    const assets = assetsRef.current
    alertsRef.current.forEach((alert) => {
      if (firedIds.current.has(alert.id)) return
      const asset = assets[alert.symbol]
      if (!asset) return
      const currentPrice = asset.currentPrice
      const prevPrice = pricesRef.current[alert.symbol]

      const crosses =
        alert.type === 'above'
          ? prevPrice !== undefined && prevPrice < alert.targetPrice && currentPrice >= alert.targetPrice
          : prevPrice !== undefined && prevPrice > alert.targetPrice && currentPrice <= alert.targetPrice

      if (crosses) {
        firedIds.current.add(alert.id)
        onFiredRef.current({
          id: alert.id,
          symbol: alert.symbol,
          assetName: asset.name,
          type: alert.type,
          targetPrice: alert.targetPrice,
          currentPrice,
          firedAt: Date.now(),
        })
        if (uid) {
          deactivatePriceAlert(uid, alert.id).catch(() => null)
        }
      }
    })
  }, [uid])

  useEffect(() => {
    if (!uid) return

    const unsubAlerts = onPriceAlerts(uid, (alerts) => {
      alertsRef.current = alerts
    })

    const unsubAssets = onAssets((assetList) => {
      assetList.forEach((a) => {
        const prev = assetsRef.current[a.symbol]
        if (prev) {
          pricesRef.current[a.symbol] = prev.currentPrice
        }
        assetsRef.current[a.symbol] = a
      })
      check()
    })

    return () => {
      unsubAlerts()
      unsubAssets()
    }
  }, [uid, check])
}
