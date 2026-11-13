import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, Radio } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const routeState = location.state as { from?: { pathname?: string } } | null
  const from = routeState?.from?.pathname || '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const ok = await login(email, password)
      if (ok) {
        navigate(from, { replace: true })
      } else {
        setError('Email ou mot de passe incorrect.')
      }
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Impossible de joindre le serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D21034] text-white">
            <Radio className="h-6 w-6" />
          </span>
          <h1 className="mt-4 font-editorial text-xl font-black text-neutral-950">
            Radio Douvanjou
          </h1>
          <p className="text-sm text-neutral-500">Connexion administration</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {error}
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#D21034]"
              placeholder="admin@radiodouvanjou.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-600">
              Mot de passe
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-[#D21034]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#D21034] py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b] disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Utilisez les identifiants de votre compte administrateur.
        </p>
      </div>
    </div>
  )
}