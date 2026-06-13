import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium border backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300 ${
      type === 'success'
        ? 'bg-navy-card border-gain/30 text-white'
        : 'bg-navy-card border-loss/30 text-white'
    }`}>
      {type === 'success'
        ? <CheckCircle className="w-4 h-4 text-gain flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-loss flex-shrink-0" />
      }
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/30 hover:text-white transition">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
