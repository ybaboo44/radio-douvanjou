import { useEffect, useState } from 'react'
import {
  Play,
  Pause,
  Pencil,
  Trash2,
  RefreshCw,
  Plus,
  ExternalLink,
  Radio,
  Rss,
  Youtube,
  FileText,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { Feed } from '@/types/admin'

const TYPE_ICONS = {
  RADIO_LIVE: Radio,
  PODCAST_RSS: Rss,
  NEWS_RSS: FileText,
  YOUTUBE: Youtube,
  OTHER: Rss,
} as const

const TYPE_LABELS = {
  RADIO_LIVE: 'Radio Live',
  PODCAST_RSS: 'Podcast RSS',
  NEWS_RSS: 'Actualités RSS',
  YOUTUBE: 'YouTube',
  OTHER: 'Autre',
} as const

type FeedForm = {
  name: string
  type: Feed['type']
  url: string
  description: string
  syncFrequency: number
  status: Feed['status']
}

const EMPTY_FORM: FeedForm = {
  name: '',
  type: 'PODCAST_RSS',
  url: '',
  description: '',
  syncFrequency: 60,
  status: 'ACTIVE',
}

export default function AdminFeeds() {
  const { can } = useAuth()

  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Feed | null>(null)
  const [syncing, setSyncing] = useState<string | null>(null)

  const [form, setForm] = useState<FeedForm>(EMPTY_FORM)

  useEffect(() => {
    fetchFeeds()
  }, [])

  async function fetchFeeds() {
    try {
      const r = await fetch('/api/admin/feeds')

      if (r.ok) {
        const data = await r.json()
        setFeeds(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Erreur chargement des flux:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const url = editing
      ? `/api/admin/feeds/${editing.id}`
      : '/api/admin/feeds'

    const r = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (r.ok) {
      setShowForm(false)
      setEditing(null)
      setForm({ ...EMPTY_FORM })
      await fetchFeeds()
    } else {
      try {
        const error = await r.json()
        alert(error.error || 'Erreur lors de l’enregistrement du flux.')
      } catch {
        alert('Erreur lors de l’enregistrement du flux.')
      }
    }
  }

  async function syncNow(id: string) {
    setSyncing(id)

    try {
      const response = await fetch(`/api/admin/feeds/${id}/sync`, {
        method: 'POST',
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null
        throw new Error(body?.error || `Erreur HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation du flux :', error)
      alert(error instanceof Error ? error.message : 'Impossible de synchroniser ce flux.')
    } finally {
      setSyncing(null)
      await fetchFeeds()
    }
  }

  async function deleteFeed(id: string) {
    if (!confirm('Supprimer ce flux ?')) return

    await fetch(`/api/admin/feeds/${id}`, {
      method: 'DELETE',
    })

    await fetchFeeds()
  }

  async function toggleStatus(feed: Feed) {
    const newStatus: Feed['status'] =
      feed.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'

    await fetch(`/api/admin/feeds/${feed.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...feed,
        status: newStatus,
      }),
    })

    await fetchFeeds()
  }

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setShowForm(true)
  }

  function openEdit(feed: Feed) {
    setEditing(feed)

    setForm({
      name: feed.name,
      type: feed.type,
      url: feed.url,
      description: feed.description || '',
      syncFrequency: feed.syncFrequency,
      status: feed.status,
    })

    setShowForm(true)
  }

  if (!can('feeds:read')) {
    return (
      <div className="py-20 text-center text-red-600">
        Accès interdit.
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
            Flux
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Gestion des flux RSS, radio et podcasts.
          </p>
        </div>

        {can('feeds:create') && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white hover:bg-[#b00d2b]"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouveau flux
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-neutral-400">Chargement…</p>
        ) : feeds.length === 0 ? (
          <p className="text-neutral-400">
            Aucun flux configuré.
          </p>
        ) : (
          feeds.map((feed) => {
            const Icon = TYPE_ICONS[feed.type]

            return (
              <div
                key={feed.id}
                className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                    <Icon className="h-5 w-5" />
                  </span>

                  <div>
                    <div className="font-bold text-neutral-900">
                      {feed.name}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium">
                        {TYPE_LABELS[feed.type]}
                      </span>

                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 font-medium',
                          feed.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-200 text-neutral-600'
                        )}
                      >
                        {feed.status === 'ACTIVE'
                          ? 'Actif'
                          : 'Inactif'}
                      </span>

                      {feed.lastSyncAt && (
                        <span>
                          Synchronisé le{' '}
                          {new Date(feed.lastSyncAt).toLocaleString(
                            'fr-FR'
                          )}
                        </span>
                      )}
                    </div>

                    <code className="mt-1 block break-all text-[11px] text-neutral-400">
                      {feed.url}
                    </code>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {can('feeds:update') && (
                    <button
                      onClick={() => toggleStatus(feed)}
                      className="rounded p-2 text-neutral-500 hover:bg-neutral-100"
                      title="Activer/Désactiver"
                    >
                      {feed.status === 'ACTIVE' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                  )}

                  {can('feeds:sync') && (
                    <button
                      onClick={() => syncNow(feed.id)}
                      disabled={syncing === feed.id}
                      className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-[#00209F]"
                      title="Synchroniser maintenant"
                    >
                      <RefreshCw
                        className={cn(
                          'h-4 w-4',
                          syncing === feed.id && 'animate-spin'
                        )}
                      />
                    </button>
                  )}

                  <a
                    href={feed.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-2 text-neutral-500 hover:bg-neutral-100"
                    title="Ouvrir le flux"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {can('feeds:update') && (
                    <button
                      onClick={() => openEdit(feed)}
                      className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-[#00209F]"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}

                  {can('feeds:delete') && (
                    <button
                      onClick={() => deleteFeed(feed.id)}
                      className="rounded p-2 text-neutral-500 hover:bg-red-50 hover:text-[#D21034]"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="font-editorial text-lg font-black text-neutral-950">
              {editing ? 'Modifier' : 'Nouveau'} flux
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                  Nom
                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                    Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        type: e.target.value as Feed['type'],
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                  >
                    {Object.entries(TYPE_LABELS).map(
                      ([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                    Fréquence (min)
                  </label>

                  <input
                    type="number"
                    min={5}
                    value={form.syncFrequency}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        syncFrequency: Number(e.target.value),
                      }))
                    }
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                  URL
                </label>

                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      url: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-neutral-500">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white hover:bg-[#b00d2b]"
                >
                  {editing ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}