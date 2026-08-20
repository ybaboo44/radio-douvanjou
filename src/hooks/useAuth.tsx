import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'

type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'EDITOR'
  | 'ANIMATOR'
  | 'USER'

interface AuthUser {
  id: string
  firstName: string
  lastName: string
  name?: string
  email: string
  role: UserRole
  permissions: string[]
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
  lastLoginAt?: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  can: (permission: string) => boolean
  isSuperAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

/**
 * Compte administrateur par défaut pour le MVP.
 *
 * IMPORTANT :
 * En production, le mot de passe doit être géré côté serveur
 * avec une vraie authentification et une base de données.
 */
const DEFAULT_ADMIN = {
  email: 'radiodouvanjou@gmail.com',
  password: 'admin123',

  user: {
    id: '1',
    firstName: 'Administrateur',
    lastName: 'Principal',
    name: 'Administrateur',
    email: 'radiodouvanjou@gmail.com',
    role: 'SUPER_ADMIN' as const,
    status: 'ACTIVE' as const,
    createdAt: new Date().toISOString(),

    permissions: [
      // Utilisateurs
      'users:read',
      'users:create',
      'users:update',
      'users:delete',

      // Podcasts
      'podcasts:read',
      'podcasts:create',
      'podcasts:update',
      'podcasts:delete',

      // Flux
      'feeds:read',
      'feeds:sync',
      'feeds:create',
      'feeds:update',
      'feeds:delete',

      // Paramètres
      'settings:read',
      'settings:update',

      // Articles
      'articles:read',
      'articles:create',
      'articles:update',
      'articles:delete',

      // Vidéos
      'videos:read',
      'videos:create',
      'videos:update',
      'videos:delete',

      // Émissions
      'shows:read',
      'shows:create',
      'shows:update',
      'shows:delete',

      // Événements
      'events:read',
      'events:create',
      'events:update',
      'events:delete',
    ],
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Restauration de la session depuis localStorage.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rdm_auth_user')

      if (stored) {
        const parsedUser = JSON.parse(stored) as AuthUser

        if (parsedUser && parsedUser.email && parsedUser.role) {
          setUser(parsedUser)
        } else {
          localStorage.removeItem('rdm_auth_user')
        }
      }
    } catch (error) {
      console.error('Erreur lors de la restauration de la session :', error)
      localStorage.removeItem('rdm_auth_user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Connexion.
   */
  const login = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase()

    /**
     * Connexion du compte administrateur principal.
     */
    if (
      normalizedEmail === DEFAULT_ADMIN.email &&
      password === DEFAULT_ADMIN.password
    ) {
      setUser(DEFAULT_ADMIN.user)

      localStorage.setItem(
        'rdm_auth_user',
        JSON.stringify(DEFAULT_ADMIN.user),
      )

      return true
    }

    /**
     * Connexion des utilisateurs créés depuis l'administration.
     */
    try {
      const storedUsers = localStorage.getItem('rdm_users')
      const users = storedUsers ? JSON.parse(storedUsers) : []

      if (!Array.isArray(users)) {
        return false
      }

      const foundUser = users.find(
        (u: {
          email?: string
          password?: string
          status?: 'ACTIVE' | 'INACTIVE'
        }) =>
          u.email?.trim().toLowerCase() === normalizedEmail &&
          u.password === password &&
          u.status !== 'INACTIVE',
      )

      if (!foundUser) {
        return false
      }

      /**
       * On ne conserve jamais le mot de passe
       * dans la session utilisateur.
       */
      const {
        password: _password,
        ...userWithoutPassword
      } = foundUser

      const authenticatedUser: AuthUser = {
        ...userWithoutPassword,
        permissions: Array.isArray(userWithoutPassword.permissions)
          ? userWithoutPassword.permissions
          : [],
      }

      setUser(authenticatedUser)

      localStorage.setItem(
        'rdm_auth_user',
        JSON.stringify(authenticatedUser),
      )

      return true
    } catch (error) {
      console.error('Erreur de connexion :', error)
      return false
    }
  }

  /**
   * Déconnexion.
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem('rdm_auth_user')
  }

  /**
   * Vérifie une permission.
   *
   * SUPER_ADMIN et ADMIN ont accès à toutes les permissions.
   */
  const can = (permission: string): boolean => {
    if (!user) {
      return false
    }

    if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ADMIN'
    ) {
      return true
    }

    return user.permissions?.includes(permission) ?? false
  }

  /**
   * Indique si l'utilisateur connecté est Super Admin.
   *
   * Utilisé notamment dans Users.tsx pour autoriser
   * la suppression définitive des comptes.
   */
  const isSuperAdmin =
    user?.role === 'SUPER_ADMIN'

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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error(
      'useAuth doit être utilisé dans un AuthProvider',
    )
  }

  return ctx
}