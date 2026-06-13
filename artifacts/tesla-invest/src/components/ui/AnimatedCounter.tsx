import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  duration = 1200,
  className = '',
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    startRef.current = null

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(from + (to - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        fromRef.current = to
        setDisplayValue(to)
      }
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = displayValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span className={`num ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
