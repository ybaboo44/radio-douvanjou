import { useContext } from 'react'
import { SiteSettingsContext } from '@/store/site-settings-context'

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) throw new Error('useSiteSettings doit être utilisé dans un SiteSettingsProvider')
  return context
}
