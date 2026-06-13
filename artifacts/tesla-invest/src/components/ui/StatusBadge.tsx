interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge-${status}`}>{status}</span>
}
