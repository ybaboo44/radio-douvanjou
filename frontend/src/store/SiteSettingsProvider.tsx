import { useEffect, useState, type ReactNode } from 'react'
import { SITE, STREAMS } from '@/config'
import type { Setting } from '@/types/admin'
import { SiteSettingsContext } from '@/store/site-settings-context'

const DEFAULT_SETTINGS: Setting[] = [
  { id: 'site.name', category: 'GENERAL', key: 'site.name', label: 'Nom du site', value: SITE.name },
  { id: 'site.tagline', category: 'GENERAL', key: 'site.tagline', label: 'Slogan', value: SITE.tagline },
  { id: 'site.description', category: 'GENERAL', key: 'site.description', label: 'Description', value: SITE.description },
  { id: 'site.email', category: 'GENERAL', key: 'site.email', label: 'Adresse e-mail', value: SITE.email },
  { id: 'site.phone', category: 'GENERAL', key: 'site.phone', label: 'Téléphone', value: SITE.phone },
  { id: 'site.address', category: 'GENERAL', key: 'site.address', label: 'Adresse', value: SITE.address },
  { id: 'social.facebook', category: 'SOCIAL', key: 'social.facebook', label: 'Facebook', value: SITE.social.facebook },
  { id: 'social.twitter', category: 'SOCIAL', key: 'social.twitter', label: 'X / Twitter', value: SITE.social.twitter },
  { id: 'social.instagram', category: 'SOCIAL', key: 'social.instagram', label: 'Instagram', value: SITE.social.instagram },
  { id: 'social.youtube', category: 'SOCIAL', key: 'social.youtube', label: 'YouTube', value: SITE.social.youtube },
  { id: 'radio.name', category: 'RADIO', key: 'radio.name', label: 'Nom de la radio', value: STREAMS.radio.mountName },
  { id: 'radio.url', category: 'RADIO', key: 'radio.url', label: 'URL du flux radio', value: STREAMS.radio.url },
  { id: 'tv.name', category: 'RADIO', key: 'tv.name', label: 'Nom de la chaîne TV', value: STREAMS.tv.channelName },
  { id: 'tv.url', category: 'RADIO', key: 'tv.url', label: 'URL du flux TV (HLS)', value: STREAMS.tv.url },
  { id: 'podcast.description', category: 'PODCAST', key: 'podcast.description', label: 'Présentation des podcasts', value: 'Réécoutez les émissions et les grands entretiens de Radio Douvanjou, où que vous soyez.' },
  { id: 'podcast.feedUrl', category: 'PODCAST', key: 'podcast.feedUrl', label: 'URL du flux RSS', value: '' },
]

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Setting[]>(DEFAULT_SETTINGS)

  useEffect(() => {
    let active = true
    fetch('/api/public/settings', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<Setting[]>
      })
      .then((remoteSettings) => {
        if (active && Array.isArray(remoteSettings)) setSettings(remoteSettings)
      })
      .catch((error: unknown) => console.error('Impossible de charger les paramètres du site :', error))
    return () => {
      active = false
    }
  }, [])

  async function saveSettings(nextSettings: Setting[]) {
    const response = await fetch('/api/admin/settings', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(nextSettings),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => null) as { error?: string } | null
      throw new Error(body?.error || `Erreur HTTP ${response.status}`)
    }
    const savedSettings = await response.json() as Setting[]
    setSettings(savedSettings)
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, saveSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}
