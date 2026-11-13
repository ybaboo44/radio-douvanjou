import { useEffect, useState } from 'react'
import { Save, RotateCcw, Globe, Radio, Podcast, Share2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSiteSettings } from '@/store/useSiteSettings'
import type { Setting } from '@/types/admin'

const TABS = [
  { key: 'GENERAL', label: 'Général', icon: Globe },
  { key: 'SOCIAL', label: 'Réseaux sociaux', icon: Share2 },
  { key: 'RADIO', label: 'Radio & TV', icon: Radio },
  { key: 'PODCAST', label: 'Podcasts', icon: Podcast },
] as const

export default function AdminSettings() {
  const { can } = useAuth()
  const { settings: savedSettings, saveSettings } = useSiteSettings()
  const [settings, setSettings] = useState<Setting[]>(savedSettings)
  const [tab, setTab] = useState<'GENERAL' | 'SOCIAL' | 'RADIO' | 'PODCAST'>('GENERAL')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetch('/api/admin/settings', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<Setting[]>
      })
      .then((remoteSettings) => {
        if (active && Array.isArray(remoteSettings)) setSettings(remoteSettings)
      })
      .catch((loadError: unknown) => {
        console.error('Erreur lors du chargement des paramètres :', loadError)
        if (active) setError('Impossible de charger les paramètres depuis le serveur.')
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = settings.filter(s => s.category === tab)

  async function handleSave() {
    try {
      await saveSettings(settings)
      setError('')
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2000)
    } catch (saveError) {
      console.error('Erreur lors de l’enregistrement des paramètres :', saveError)
      setSaved(false)
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer les paramètres.')
    }
  }

  function updateValue(key: string, value: string) {
    setSaved(false)
    setError('')
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  if (!can('settings:read')) return <div className="py-20 text-center text-red-600">Accès interdit.</div>

  return (
    <div className="w-full max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Paramètres</h1>
          <p className="mt-1 text-sm text-neutral-500">Configuration générale de la plateforme.</p>
        </div>
        {can('settings:update') && (
          <button onClick={handleSave} className="flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b]">
            <Save className="h-3.5 w-3.5" /> {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-neutral-200 bg-white p-1 sm:flex sm:overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={tab === t.key ? 'flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg bg-[#D21034] px-2 py-2 text-[11px] font-bold text-white sm:shrink-0 sm:px-3 sm:text-xs' : 'flex min-h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-bold text-neutral-600 hover:bg-neutral-100 sm:shrink-0 sm:px-3 sm:text-xs'}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 min-w-0 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
        {filtered.length === 0 ? <p className="text-sm text-neutral-400">Aucun paramètre dans cette catégorie.</p> : (
          <div className="space-y-4">
            {filtered.map(s => (
              <div key={s.key}>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-500">{s.label}</label>
                {s.key === 'site.description' || s.key === 'podcast.description' ? (
                  <textarea
                    value={s.value}
                    onChange={e => updateValue(s.key, e.target.value)}
                    disabled={!can('settings:update')}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034] disabled:bg-neutral-50"
                  />
                ) : (
                  <input
                    type={s.key.endsWith('.email') ? 'email' : s.key.startsWith('social.') || s.key.endsWith('.url') || s.key.endsWith('feedUrl') ? 'url' : s.key === 'site.phone' ? 'tel' : 'text'}
                    value={s.value}
                    onChange={e => updateValue(s.key, e.target.value)}
                    disabled={!can('settings:update')}
                    placeholder={s.key.startsWith('social.') || s.key.endsWith('.url') || s.key.endsWith('feedUrl') ? 'https://' : undefined}
                    className="w-full min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034] disabled:bg-neutral-50"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {can('settings:update') && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Les paramètres sont enregistrés dans ce navigateur et appliqués au site public sur cet appareil après enregistrement.</p>
          </div>
        </div>
      )}
    </div>
  )
}