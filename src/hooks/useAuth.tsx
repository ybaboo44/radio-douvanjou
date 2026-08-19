import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor'
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  can: (permission: string) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEFAULT_ADMIN = {
  email: 'radiodouvanjou@gmail.com',
  password: 'admin123',
  user: {
    id: '1',
    name: 'Administrateur',
    email: 'radiodouvanjou@gmail.com',
    role: 'admin' as const,
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'podcasts:read', 'podcasts:create', 'podcasts:update', 'podcasts:delete',
      'feeds:read', 'feeds:sync', 'feeds:create', 'feeds:update', 'feeds:delete',
      'settings:read', 'settings:update',
      'articles:read', 'articles:create', 'articles:update', 'articles:delete',
      'videos:read', 'videos:create', 'videos:update', 'videos:delete',
      'shows:read', 'shows:create', 'shows:update', 'shows:delete',
      'events:read', 'events:create', 'events:update', 'events:delete',
    ]
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('rdm_auth_user')
      if (stored) setUser(JSON.parse(stored))
    } catch (err) {
      console.error('Auth restore error:', err)
      localStorage.removeItem('rdm_auth_user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      setUser(DEFAULT_ADMIN.user)
      localStorage.setItem('rdm_auth_user', JSON.stringify(DEFAULT_ADMIN.user))
      return true
    }

    try {
      const users = JSON.parse(localStorage.getItem('rdm_users') || '[]')
      const found = users.find((u: any) => u.email === email && u.password === password)
      if (found) {
        const { password: _, ...userWithoutPassword } = found
        setUser(userWithoutPassword)
        localStorage.setItem('rdm_auth_user', JSON.stringify(userWithoutPassword))
        return true
      }
    } catch {
      // ignore
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rdm_auth_user')
  }

  const can = (permission: string): boolean => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.permissions?.includes(permission) ?? false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, can, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return ctx
}