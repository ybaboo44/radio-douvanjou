import { createContext } from 'react'
import type { Setting } from '@/types/admin'

export interface SiteSettingsContextValue {
  settings: Setting[]
  saveSettings: (settings: Setting[]) => Promise<void>
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)
