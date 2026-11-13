import { useContext } from 'react'
import { DataContext, type DataContextValue } from './data-context'

export function useData(): DataContextValue {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData doit être utilisé dans un DataProvider')
  return context
}
