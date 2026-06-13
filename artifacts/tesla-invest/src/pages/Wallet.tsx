import { useState } from 'react'
import { Banknote, Lock, TrendingUp, Info, AlertTriangle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useBalance } from '../hooks/useBalance'
import { useTransactions } from '../hooks/useTransactions'
import { createDepositRequest, createWithdrawalRequest } from '../lib/firestore'
import { StatusBadge } from '../components/ui/StatusBadge'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { Toast } from '../components/ui/Toast'
import { PageTransition } from '../components/ui/PageTransition'

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(d: Date | null) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export function Wallet() {
  const { currentUser, userDoc } = useAuth()
  const uid = currentUser?.uid
  const balance = useBalance(uid)
  const txs = useTransactions(uid)

  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [txFilter, setTxFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'pending'>('all')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')

  async function handleDeposit() {
    if (!uid) return
    const amt = parseFloat(amount)
    if (!amt || amt < 10) { setError('Minimum deposit is $10'); return }
    setError('')
    setLoading(true)
    try {
      await createDepositRequest(uid, userDoc?.name || currentUser?.displayName || 'User', amt, note)
      setToast('Deposit request submitted!')
      setAmount('')
      setNote('')
    } catch {
      setError('Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleWithdraw() {
    if (!uid) return
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Enter a valid amount'); return }
    if (amt > balance.available) { setError('Amount exceeds available balance'); return }
    setError('')
    setLoading(true)
    try {
      await createWithdrawalRequest(uid, userDoc?.name || currentUser?.displayName || 'User', amt, note)
      setToast('Withdrawal request submitted!')
      setAmount('')
      setNote('')
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTxs = txs.filter((tx) => {
    if (txFilter === 'all') return true
    if (txFilter === 'pending') return tx.status === 'pending'
    return tx.type === txFilter
  })

  return (
    <PageTransition>
      <div className="space-y-6">
        {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}

        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            {[
              {
                icon: Banknote, iconColor: 'text-gain', iconBg: 'bg-gain/10',
                label: 'Available Balance', value: balance.available, textColor: 'text-white',
                sub: 'Ready to trade or withdraw',
              },
              {
                icon: Lock, iconColor: 'text-yellow-400', iconBg: 'bg-yellow-400/10',
                label: 'Locked (Pending)', value: balance.locked, textColor: 'text-yellow-400',
                sub: 'Awaiting admin approval',
              },
              {
                icon: TrendingUp, iconColor: 'text-accent', iconBg: 'bg-accent/10',
                label: 'Total Deposited', value: balance.total, textColor: 'text-white',
                sub: 'Lifetime deposits approved',
              },
            ].map(({ icon: Icon, iconColor, iconBg, label, value, textColor, sub }) => (
              <div key={label} className="card p-6">
                <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <p className="text-xs text-white/50 uppercase tracking-wider mt-4">{label}</p>
                <p className={`text-3xl font-medium num mt-1 ${textColor}`}>${fmt(value)}</p>
                <p className="text-xs text-white/30 mt-1">{sub}</p>
              </div>
            ))}
          </div>

          <div className="col-span-2 card p-6">
            <div className="bg-navy-raised rounded-xl p-1 flex gap-1 mb-6 w-fit">
              {(['deposit', 'withdraw'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); setAmount(''); setNote('') }}
                  className={`px-5 py-2 text-sm rounded-lg capitalize transition ${
                    tab === t ? 'bg-accent text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="max-w-md space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-2 block">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-navy-raised border border-white/[0.07] rounded-lg pl-8 pr-4 py-3 text-white text-sm w-full focus:outline-none focus:border-accent/50 num"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-2 block">
                  {tab === 'deposit' ? 'Payment reference / proof of transfer' : 'Wallet address or bank details'}
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={tab === 'deposit'
                    ? 'Add payment reference or proof of transfer details'
                    : 'Add your wallet address or bank details for the payout'}
                  className="text-sm text-white/70 bg-navy-raised border border-white/[0.07] rounded-lg p-3 resize-none h-24 w-full focus:outline-none focus:border-accent/50 placeholder-white/30"
                />
              </div>

              {tab === 'deposit' ? (
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 flex gap-3">
                  <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/60">
                    Your deposit request will be reviewed and approved by our team, typically within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/60">
                    Funds will be locked immediately upon request and released after admin review.
                  </p>
                </div>
              )}

              {error && <p className="text-loss text-xs">{error}</p>}

              <button
                onClick={tab === 'deposit' ? handleDeposit : handleWithdraw}
                disabled={loading}
                className={`w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition disabled:opacity-60 ${
                  tab === 'deposit'
                    ? 'btn-primary'
                    : 'bg-yellow-500 hover:bg-yellow-400 text-navy-base'
                }`}
              >
                {loading && <Spinner size={14} />}
                {tab === 'deposit' ? 'Request Deposit' : 'Request Withdrawal'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-white">Transaction History</h2>
              <span className="bg-navy-raised text-white/50 text-xs px-2 py-0.5 rounded-full">{txs.length}</span>
            </div>
            <div className="flex gap-1 bg-navy-raised rounded-xl p-1">
              {(['all', 'deposit', 'withdrawal', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTxFilter(f)}
                  className={`px-3 py-1 text-xs rounded-lg capitalize transition ${
                    txFilter === f ? 'bg-accent text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-3 border-b border-white/[0.07] text-xs text-white/40 uppercase tracking-wider">
              <span>Type</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Note</span>
              <span>Date</span>
            </div>
            {filteredTxs.length === 0 ? (
              <EmptyState message="No transactions yet. Make your first deposit above." />
            ) : (
              filteredTxs.map((tx) => (
                <div key={tx.id} className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/[0.05] hover:bg-navy-raised/40 items-center">
                  <div className="flex items-center gap-2">
                    {tx.type === 'deposit'
                      ? <ArrowDownCircle className="w-4 h-4 text-gain flex-shrink-0" />
                      : <ArrowUpCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    }
                    <span className="text-sm text-white capitalize">{tx.type}</span>
                  </div>
                  <span className={`num text-sm font-medium ${tx.type === 'deposit' ? 'text-gain' : 'text-loss'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}${fmt(tx.amount)}
                  </span>
                  <StatusBadge status={tx.status} />
                  <span className="text-xs text-white/40 truncate">{tx.note || '—'}</span>
                  <span className="text-xs text-white/40">{formatDate(tx.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
