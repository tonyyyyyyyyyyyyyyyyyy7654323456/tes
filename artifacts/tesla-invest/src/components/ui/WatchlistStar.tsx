import { Star } from 'lucide-react'

interface WatchlistStarProps {
  isWatched: boolean
  onToggle: () => void
  className?: string
}

export function WatchlistStar({ isWatched, onToggle, className = '' }: WatchlistStarProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      className={`p-1 rounded-lg transition-all duration-200 ${
        isWatched
          ? 'text-buy hover:text-buy/70'
          : 'text-white/20 hover:text-white/50'
      } ${className}`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Star className={`w-4 h-4 ${isWatched ? 'fill-buy' : ''}`} />
    </button>
  )
}
