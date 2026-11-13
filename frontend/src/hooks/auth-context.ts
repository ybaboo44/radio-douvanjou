import { createContext } from 'react'

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'ANIMATOR' | 'USER'

export interface AuthUser {
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

export interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  can: (permission: string) => boolean
  isSuperAdmin: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)
