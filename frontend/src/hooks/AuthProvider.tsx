import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetch('/api/auth/me', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<{ user: AuthUser | null }>
      })
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch((error: unknown) => {
        console.error('Erreur lors de la restauration de la session :', error)
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json() as { user?: AuthUser; error?: string }
      if (!response.ok) {
        if (response.status !== 401) throw new Error(data.error || `Erreur HTTP ${response.status}`)
        return false
      }
      if (!data.user) throw new Error('La réponse de connexion ne contient pas de compte.')
      setUser(data.user)
      return true
    } catch (error) {
      console.error('Erreur de connexion :', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    void fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    }).then((response) => {
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
    }).catch((error: unknown) => {
      console.error('Erreur lors de la déconnexion :', error)
    })
  }

  const can = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') return true
    return user.permissions?.includes(permission) ?? false
  }

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        can,
        isSuperAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}