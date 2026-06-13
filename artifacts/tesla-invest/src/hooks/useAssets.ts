import { useState, useEffect } from 'react'
import { onAssets } from '../lib/firestore'
import type { Asset, PriceMap } from '../types'

export function useAssets(): { assets: Asset[]; priceMap: PriceMap } {
  const [assets, setAssets] = useState<Asset[]>([])

  useEffect(() => {
    return onAssets(setAssets)
  }, [])

  const priceMap: PriceMap = {}
  assets.forEach((a) => { priceMap[a.symbol] = a })

  return { assets, priceMap }
}
