import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShieldCheck, Zap, BarChart3 } from 'lucide-react'
import { Logo } from '../components/ui/Logo'
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/ui/PageTransition'

const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  v: 180 + Math.sin(i * 0.4) * 20 + Math.random() * 10,
}))

const mockTickers = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$248.42', change: '+3.21%', positive: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,420', change: '+1.84%', positive: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,521', change: '-0.62%', positive: false },
]

const steps = [
  {
    num: '01',
    icon: <TrendingUp className="w-7 h-7 text-accent" />,
    title: 'Fund your account',
    desc: 'Submit a deposit request. Our team reviews and approves it, typically within 24 hours.',
  },
  {
    num: '02',
    icon: <BarChart3 className="w-7 h-7 text-accent" />,
    title: 'Browse live assets',
    desc: 'Explore Tesla stock, Bitcoin, Ethereum and more — all at real-time market prices.',
  },
  {
    num: '03',
    icon: <Zap className="w-7 h-7 text-accent" />,
    title: 'Execute orders',
    desc: 'Buy and sell instantly. Track your portfolio performance and P&L in real time.',
  },
]

const features = [
  { icon: <ShieldCheck className="w-5 h-5 text-accent" />, title: 'Firebase Auth', desc: 'Secure Google & email login' },
  { icon: <TrendingUp className="w-5 h-5 text-accent" />, title: 'Live Prices', desc: 'Updated every 10 seconds' },
  { icon: <Zap className="w-5 h-5 text-accent" />, title: 'Instant Orders', desc: 'Real-time Firestore execution' },
  { icon: <BarChart3 className="w-5 h-5 text-accent" />, title: 'Portfolio Tracking', desc: 'P&L analytics at a glance' },
]

export function Landing() {
  return (
    <div className="bg-[#F8F9FC] min-h-screen">
      {/* Navbar */}
      <nav className="bg-[#F8F9FC]/80 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-content mx-auto px-8 h-16 flex items-center justify-between">
          <Logo size="sm" textColor="text-gray-900" />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="border border-gray-300 text-gray-700 rounded-full px-5 py-2 text-sm hover:bg-gray-100 transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="bg-accent text-white rounded-full px-5 py-2 text-sm hover:bg-accent/90 transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-[92vh] grid md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col justify-center pl-8 md:pl-24 pr-8 py-16"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="bg-accent/10 text-accent text-xs px-3 py-1 rounded-full inline-block mb-6 w-fit"
          >
            Live Prices · Real Orders · Instant Execution
          </motion.span>
          <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] tracking-tight text-gray-950">
            Invest in Tesla
            <br />
            <span className="text-accent">&amp; Top Assets</span>
          </h1>
          <p className="text-gray-500 text-lg mt-6 max-w-sm leading-relaxed">
            A live demo trading platform. Practice buying stocks and crypto with real market prices, no risk.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-10 flex gap-3"
          >
            <Link
              to="/register"
              className="bg-accent text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-accent/90 transition"
            >
              Start Trading
            </Link>
            <Link
              to="/markets"
              className="border border-gray-300 text-gray-700 rounded-full px-6 py-3 text-sm hover:bg-gray-100 transition"
            >
              View Markets
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-14 flex gap-10"
          >
            {[
              { stat: '9 Assets', label: 'Available to trade' },
              { stat: 'Live Prices', label: 'Updated every 10s' },
              { stat: 'Instant', label: 'Order execution' },
            ].map((s) => (
              <div key={s.stat}>
                <p className="text-2xl font-medium text-gray-950">{s.stat}</p>
                <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="hidden md:flex items-center justify-center pr-16 py-16"
        >
          <div className="bg-navy-base rounded-3xl shadow-2xl shadow-navy-base/50 p-6 w-80">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Portfolio</p>
            <p className="text-white text-2xl font-medium num">$24,831.50</p>
            <p className="text-gain text-xs mt-1">+$842.30 (+3.51%) today</p>

            <div className="mt-4 -mx-2">
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={2} fill="url(#cg)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2.5">
              {mockTickers.map((t) => (
                <div key={t.symbol} className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-medium">
                      {t.symbol[0]}
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">{t.symbol}</p>
                      <p className="text-white/40 text-[10px]">{t.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xs num">{t.price}</p>
                    <p className={`text-[10px] num ${t.positive ? 'text-gain' : 'text-loss'}`}>{t.change}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full bg-buy text-navy-base rounded-lg py-2.5 text-sm font-medium hover:bg-buy/90 transition">
              Buy TSLA
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features strip */}
      <ScrollReveal>
        <section className="bg-white border-y border-gray-100 py-12">
          <div className="max-w-content mx-auto px-8">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {features.map((f) => (
                <StaggerItem key={f.title}>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                      {f.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{f.title}</p>
                      <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </ScrollReveal>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="max-w-content mx-auto px-8">
          <ScrollReveal>
            <h2 className="text-3xl font-medium tracking-tight text-gray-950 text-center mb-16">How it works</h2>
          </ScrollReveal>
          <StaggerContainer className="grid md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <StaggerItem key={step.num}>
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-medium tracking-wider mb-4">{step.num}</div>
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-950 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal>
        <section className="bg-navy-base py-20">
          <div className="max-w-content mx-auto px-8 text-center">
            <h2 className="text-3xl font-medium text-white tracking-tight mb-4">Ready to start trading?</h2>
            <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
              Create a free account and start practicing with live market data today.
            </p>
            <Link
              to="/register"
              className="bg-accent text-white rounded-full px-8 py-3.5 text-sm font-medium hover:bg-accent/90 transition inline-block"
            >
              Create free account →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="bg-[#F8F9FC] border-t border-gray-100 py-10">
        <div className="max-w-content mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" textColor="text-gray-900" />
            <span className="text-gray-400 text-xs">© 2025 Tesla Stock Investment. Demo platform only.</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="text-gray-500 text-sm hover:text-gray-900 transition">Sign in</Link>
            <Link to="/register" className="text-gray-500 text-sm hover:text-gray-900 transition">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
