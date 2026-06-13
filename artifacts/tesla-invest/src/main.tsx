import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import App from './App'
import './index.css'

const base = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={base}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
