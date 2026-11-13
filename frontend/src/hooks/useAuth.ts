import { useContext } from 'react'
import { AuthContext, type AuthContextType } from './auth-context'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
