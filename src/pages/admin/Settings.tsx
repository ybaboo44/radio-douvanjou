import { useEffect, useState } from 'react'
import { Save, RotateCcw, Globe, Radio, Podcast, Share2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { Setting } from '@/types/admin'

const TABS = [
  { key: 'GENERAL', label: 'Général', icon: Globe },
  { key: 'SOCIAL', label: 'Réseaux sociaux', icon: Share2 },
  { key: 'RADIO', label: 'Radio & TV', icon: Radio },
  { key: 'PODCAST', label: 'Podcasts', icon: Podcast },
] as const

export default function AdminSettings() {
  const { can } = useAuth()
  const [settings, setSettings] = useState<Setting[]>([])
  const [tab, setTab] = useState<'GENERAL' | 'SOCIAL' | 'RADIO' | 'PODCAST'>('GENERAL')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setSettings)
  }, [])

  const filtered = settings.filter(s => s.category === tab)

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateValue(key: string, value: string) {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  if (!can('settings:read')) return <div className="py-20 text-center text-red-600">Accès interdit.</div>

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Paramètres</h1>
          <p className="mt-1 text-sm text-neutral-500">Configuration générale de la plateforme.</p>
        </div>
        {can('settings:update') && (
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#b00d2b] disabled:opacity-50">
            <Save className="h-3.5 w-3.5" /> {saved ? 'Enregistré !' : saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={tab === t.key ? 'flex shrink-0 items-center gap-1.5 rounded-lg bg-[#D21034] px-3 py-2 text-xs font-bold text-white' : 'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100'}>
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
        {filtered.length === 0 ? <p className="text-sm text-neutral-400">Aucun paramètre dans cette catégorie.</p> : (
          <div className="space-y-4">
            {filtered.map(s => (
              <div key={s.key}>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-neutral-500">{s.label}</label>
                <input
                  type="text"
                  value={s.value}
                  onChange={e => updateValue(s.key, e.target.value)}
                  disabled={!can('settings:update')}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034] disabled:bg-neutral-50"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {can('settings:update') && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <div className="flex items-start gap-2">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Les modifications sont immédiatement appliquées sur le site public après enregistrement.</p>
          </div>
        </div>
      )}
    </div>
  )
}