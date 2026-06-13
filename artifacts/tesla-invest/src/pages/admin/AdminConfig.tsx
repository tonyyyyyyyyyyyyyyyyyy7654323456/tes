import { useState, useEffect } from 'react'
import { Save, Settings, AlertTriangle } from 'lucide-react'
import { getCryptoAddresses, saveCryptoAddresses } from '../../lib/firestore'
import { Spinner } from '../../components/ui/Spinner'
import { Toast } from '../../components/ui/Toast'
import { PageTransition } from '../../components/ui/PageTransition'

const NETWORKS = [
  { id: 'btc',      label: 'Bitcoin (BTC)',         network: 'Bitcoin',   placeholder: 'bc1q...' },
  { id: 'eth',      label: 'Ethereum (ETH)',         network: 'ERC-20',    placeholder: '0x...' },
  { id: 'usdt-trc20', label: 'USDT',               network: 'TRC-20',    placeholder: 'T...' },
  { id: 'usdt-erc20', label: 'USDT',               network: 'ERC-20',    placeholder: '0x...' },
  { id: 'bnb',      label: 'BNB',                   network: 'BEP-20',    placeholder: '0x...' },
  { id: 'ltc',      label: 'Litecoin (LTC)',         network: 'Litecoin',  placeholder: 'ltc1q...' },
]

export function AdminConfig() {
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    getCryptoAddresses().then((saved) => {
      if (saved) setAddresses(saved)
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await saveCryptoAddresses(addresses)
      setToast('Crypto addresses saved successfully')
    } catch {
      setToast('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} className="text-accent" />
      </div>
    )
  }

  return (
    <PageTransition>
      <div>
        {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}

        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-medium tracking-tight text-white">Platform Configuration</h1>
        </div>

        {/* Crypto Deposit Addresses */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-sm font-medium text-white">Crypto Deposit Addresses</h2>
              <p className="text-xs text-white/40 mt-1">
                Set the wallet addresses displayed to users in the Crypto Deposit flow.
                Only send the matching coin to each address.
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 py-2 text-sm disabled:opacity-60"
            >
              {saving ? <Spinner size={14} /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>

          <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl p-4 flex gap-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-white/60 leading-relaxed">
              Double-check every address before saving. Incorrect addresses will cause user funds to be sent to the wrong destination. QR codes are generated automatically from these addresses.
            </p>
          </div>

          <div className="space-y-4">
            {NETWORKS.map((net) => (
              <div key={net.id} className="grid grid-cols-[160px_1fr] gap-4 items-center">
                <div>
                  <p className="text-sm text-white font-medium">{net.label}</p>
                  <p className="text-xs text-white/40">{net.network}</p>
                </div>
                <div>
                  <input
                    type="text"
                    value={addresses[net.id] || ''}
                    onChange={(e) => setAddresses((prev) => ({ ...prev, [net.id]: e.target.value }))}
                    placeholder={net.placeholder}
                    className="w-full bg-navy-raised border border-white/[0.07] rounded-lg px-4 py-2.5 text-sm text-white font-mono placeholder-white/20 focus:outline-none focus:border-accent/50"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 py-2.5 px-6 disabled:opacity-60"
            >
              {saving ? <Spinner size={14} /> : <Save className="w-4 h-4" />}
              Save all addresses
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
