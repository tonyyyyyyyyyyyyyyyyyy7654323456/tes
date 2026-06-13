interface AssetTypeBadgeProps {
  type: 'stock' | 'crypto'
}

export function AssetTypeBadge({ type }: AssetTypeBadgeProps) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
      type === 'stock'
        ? 'bg-accent/10 text-accent'
        : 'bg-purple-500/10 text-purple-400'
    }`}>
      {type === 'stock' ? 'Stock' : 'Crypto'}
    </span>
  )
}
