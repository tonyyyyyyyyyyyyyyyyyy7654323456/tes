import { useState, useEffect } from 'react'
import { onWatchlist, addToWatchlist, removeFromWatchlist } from '../lib/firestore'

export function useWatchlist(uid: string | undefined) {
  const [watchlist, setWatchlist] = useState<string[]>([])

  useEffect(() => {
    if (!uid) return
    return onWatchlist(uid, setWatchlist)
  }, [uid])

  const isWatched = (symbol: string) => watchlist.includes(symbol)

  const toggleWatch = async (symbol: string) => {
    if (!uid) return
    if (isWatched(symbol)) {
      await removeFromWatchlist(uid, symbol)
    } else {
      await addToWatchlist(uid, symbol)
    }
  }

  return { watchlist, isWatched, toggleWatch }
}
