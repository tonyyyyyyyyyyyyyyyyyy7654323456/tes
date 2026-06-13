import { useState, useEffect, useCallback } from 'react'
import { Copy, Check, ExternalLink, RefreshCw, Bitcoin, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getCryptoAddresses, createDepositRequest } from '../../lib/firestore'
import { Spinner } from './Spinner'
import { Toast } from './Toast'

export interface CryptoNetwork {
  id: string
  name: string
  symbol: string
  network: string
  color: string
  address: string
  minDeposit: number
  confirmations: number
}

const DEFAULT_NETWORKS: CryptoNetwork[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', network: 'Bitcoin', color: '#f7931a', address: '', minDeposit: 0.0005, confirmations: 3 },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', network: 'ERC-20', color: '#627eea', address: '', minDeposit: 0.01, confirmations: 12 },
  { id: 'usdt-trc20', name: 'Tether', symbol: 'USDT', network: 'TRC-20', color: '#26a17b', address: '', minDeposit: 10, confirmations: 20 },
  { id: 'usdt-erc20', name: 'Tether', symbol: 'USDT', network: 'ERC-20', color: '#26a17b', address: '', minDeposit: 10, confirmations: 12 },
  { id: 'bnb', name: 'BNB', symbol: 'BNB', network: 'BEP-20', color: '#f3ba2f', address: '', minDeposit: 0.05, confirmations: 15 },
  { id: 'ltc', name: 'Litecoin', symbol: 'LTC', network: 'Litecoin', color: '#bfbbbb', address: '', minDeposit: 0.1, confirmations: 6 },
]

function CoinIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ backgroundColor: color + '20', color }}
    >
      {symbol.slice(0, 3)}
    </div>
  )
}

function QRCode({ address, size = 160 }: { address: string; size?: number }) {
  const [loaded, setLoaded] = useState(false)
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(address)}&format=png&margin=12&color=FFFFFF&bgcolor=0D1426`
  return (
    <div
      className="rounded-xl overflow-hidden bg-navy-raised flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {!loaded && <Spinner size={20} className="text-accent" />}
      <img
        src={url}
        alt="QR Code"
        width={size}
        height={size}
        onLoad={() => setLoaded(true)}
        className={`block ${loaded ? '' : 'hidden'}`}
      />
    </div>
  )
}

interface CopyButtonProps { text: string }
function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        copied
          ? 'bg-gain/20 text-gain'
          : 'bg-accent/10 text-accent hover:bg-accent/20'
      }`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

interface Props {
  onSuccess: (msg: string) => void
}

export function CryptoDeposit({ onSuccess }: Props) {
  const { currentUser, userDoc } = useAuth()
  const [networks, setNetworks] = useState<CryptoNetwork[]>(DEFAULT_NETWORKS)
  const [selected, setSelected] = useState<CryptoNetwork | null>(null)
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const loadAddresses = useCallback(async () => {
    setFetchLoading(true)
    try {
      const saved = await getCryptoAddresses()
      if (saved) {
        setNetworks((prev) =>
          prev.map((n) => ({
            ...n,
            address: saved[n.id] || n.address,
          }))
        )
      }
    } finally {
      setFetchLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAddresses()
  }, [loadAddresses])

  useEffect(() => {
    if (networks.length > 0 && !selected) {
      setSelected(networks[0])
    } else if (selected) {
      const updated = networks.find((n) => n.id === selected.id)
      if (updated) setSelected(updated)
    }
  }, [networks])

  async function handleSubmit() {
    if (!currentUser || !selected) return
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setError('Enter a valid USD amount'); return }
    if (!txHash.trim()) { setError('Paste your transaction hash / TXID as proof'); return }
    if (!selected.address) { setError('No deposit address configured for this network. Contact support.'); return }
    setError('')
    setLoading(true)
    try {
      const note = `Crypto deposit · ${selected.symbol} (${selected.network}) · TX: ${txHash.trim()}`
      await createDepositRequest(
        currentUser.uid,
        userDoc?.name || currentUser.displayName || 'User',
        amt,
        note,
      )
      setAmount('')
      setTxHash('')
      onSuccess(`Crypto deposit submitted! Our team will verify your ${selected.symbol} transaction.`)
    } catch {
      setError('Failed to submit. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={24} className="text-accent" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}

      {/* Network selector */}
      <div>
        <p className="text-xs text-white/50 mb-3">Select network</p>
        <div className="grid grid-cols-3 gap-2">
          {networks.map((n) => (
            <button
              key={n.id}
              onClick={() => setSelected(n)}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition ${
                selected?.id === n.id
                  ? 'border-accent bg-accent/10'
                  : 'border-white/[0.08] bg-navy-raised hover:border-white/20'
              }`}
            >
              <CoinIcon symbol={n.symbol} color={n.color} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{n.symbol}</p>
                <p className="text-[10px] text-white/40 truncate">{n.network}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <>
          {/* Address + QR */}
          {selected.address ? (
            <div className="bg-navy-raised rounded-2xl p-5">
              <div className="flex gap-5 items-start">
                <QRCode address={selected.address} size={130} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/50 mb-1">
                    {selected.symbol} Deposit Address ({selected.network})
                  </p>
                  <p className="text-xs text-white font-mono break-all leading-relaxed bg-navy-base rounded-lg px-3 py-2.5 border border-white/[0.07]">
                    {selected.address}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <CopyButton text={selected.address} />
                    <button
                      onClick={loadAddresses}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                <div className="bg-navy-base rounded-lg p-3 text-center">
                  <p className="text-white/40">Network</p>
                  <p className="text-white font-medium mt-0.5">{selected.network}</p>
                </div>
                <div className="bg-navy-base rounded-lg p-3 text-center">
                  <p className="text-white/40">Min deposit</p>
                  <p className="text-white font-medium mt-0.5">{selected.minDeposit} {selected.symbol}</p>
                </div>
                <div className="bg-navy-base rounded-lg p-3 text-center">
                  <p className="text-white/40">Confirmations</p>
                  <p className="text-white font-medium mt-0.5">{selected.confirmations}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-navy-raised rounded-2xl p-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-white/70">No address configured yet</p>
                <p className="text-xs text-white/40 mt-0.5">The admin has not set up a {selected.symbol} ({selected.network}) address. Please contact support or try another network.</p>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60 leading-relaxed">
              Only send <strong className="text-white">{selected.symbol} on the {selected.network} network</strong> to this address.
              Sending any other coin or using a different network will result in permanent loss of funds.
            </p>
          </div>

          {/* Submission form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-2 block">Amount sent (USD equivalent)</label>
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
                Transaction hash / TXID
                <span className="ml-1 text-white/30">(required as proof)</span>
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder="Paste your blockchain transaction ID here…"
                className="bg-navy-raised border border-white/[0.07] rounded-lg px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-accent/50 font-mono placeholder-white/25"
              />
              <p className="text-xs text-white/30 mt-1">
                Find this in your wallet's transaction history or on a block explorer.
              </p>
            </div>

            {error && <p className="text-loss text-xs">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !selected.address}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Spinner size={14} />}
              Submit Deposit
            </button>
          </div>
        </>
      )}
    </div>
  )
}
