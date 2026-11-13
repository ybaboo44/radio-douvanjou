import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Headphones,
  Rss,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { Podcast, Feed } from '@/types/admin'

type PodcastForm = {
  title: string
  description: string
  imageUrl: string
  category: string
  author: string
  language: string
  audioUrl: string
  duration: string
  status: Podcast['status']
  feedId: string
}

const EMPTY_FORM: PodcastForm = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
  author: '',
  language: 'fr',
  audioUrl: '',
  duration: '',
  status: 'DRAFT',
  feedId: '',
}

export default function AdminPodcasts() {
  const { can } = useAuth()
  const canReadFeeds = can('feeds:read')

  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [feeds, setFeeds] = useState<Feed[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Podcast | null>(null)

  const [form, setForm] = useState<PodcastForm>({
    ...EMPTY_FORM,
  })

  const requestPodcasts = useCallback(async () => {
    const responses = await Promise.all([
      fetch('/api/admin/podcasts', { credentials: 'same-origin', cache: 'no-store' }),
      canReadFeeds
        ? fetch('/api/admin/feeds', { credentials: 'same-origin', cache: 'no-store' })
        : Promise.resolve(null),
    ])
    const [podcastResponse, feedResponse] = responses
    if (!podcastResponse.ok || (feedResponse && !feedResponse.ok)) {
      throw new Error(`Erreur HTTP ${!podcastResponse.ok ? podcastResponse.status : feedResponse?.status}`)
    }
    const remotePodcasts = await podcastResponse.json() as Podcast[]
    const remoteFeeds = feedResponse ? await feedResponse.json() as Feed[] : []
    return {
      podcasts: Array.isArray(remotePodcasts) ? remotePodcasts : [],
      feeds: Array.isArray(remoteFeeds) ? remoteFeeds : [],
    }
  }, [canReadFeeds])

  const fetchPodcasts = useCallback(async () => {
    try {
      const result = await requestPodcasts()
      setPodcasts(result.podcasts)
      setFeeds(result.feeds)
    } catch (error) {
      console.error('Erreur lors du chargement des podcasts :', error)
      alert('Impossible de charger les podcasts depuis le serveur.')
    } finally {
      setLoading(false)
    }
  }, [requestPodcasts])

  useEffect(() => {
    let active = true
    requestPodcasts()
      .then((result) => {
        if (!active) return
        setPodcasts(result.podcasts)
        setFeeds(result.feeds)
      })
      .catch((error: unknown) => {
        console.error('Erreur lors du chargement des podcasts :', error)
        if (active) alert('Impossible de charger les podcasts depuis le serveur.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [requestPodcasts])

  function resetForm() {
    setForm({ ...EMPTY_FORM })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const response = await fetch(editing ? `/api/admin/podcasts/${editing.id}` : '/api/admin/podcasts', {
        method: editing ? 'PUT' : 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null
        throw new Error(body?.error || `Erreur HTTP ${response.status}`)
      }
      await fetchPodcasts()
      setShowForm(false)
      setEditing(null)
      resetForm()
    } catch (error) {
      console.error('Erreur lors de l’enregistrement du podcast :', error)
      alert(error instanceof Error ? error.message : 'Impossible d’enregistrer le podcast.')
    }
  }

  function importFromRss() {
    if (!confirm('Importer les épisodes depuis ce flux RSS ?')) {
      return
    }

    alert(
      'Le backend enregistre les podcasts et les flux, mais l’import automatique des épisodes RSS nécessite encore un parseur et une tâche de synchronisation.'
    )
  }

  async function toggleStatus(p: Podcast) {
    const next: Podcast['status'] =
      p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'

    await updatePodcast(p, { status: next })
  }

  async function updatePodcast(podcast: Podcast, changes: Partial<Podcast>) {
    try {
      const response = await fetch(`/api/admin/podcasts/${podcast.id}`, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...podcast, ...changes }),
      })
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
      await fetchPodcasts()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du podcast :', error)
      alert('Impossible de mettre à jour le podcast.')
    }
  }

  async function deletePodcast(id: string) {
    if (!confirm('Supprimer ce podcast ?')) {
      return
    }
    try {
      const response = await fetch(`/api/admin/podcasts/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
      await fetchPodcasts()
    } catch (error) {
      console.error('Erreur lors de la suppression du podcast :', error)
      alert('Impossible de supprimer le podcast.')
    }
  }

  function openNew() {
    setEditing(null)
    resetForm()
    setShowForm(true)
  }

  function openEdit(p: Podcast) {
    setEditing(p)

    setForm({
      title: p.title,
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      category: p.category || '',
      author: p.author || '',
      language: p.language || 'fr',
      audioUrl: p.audioUrl || '',
      duration: p.duration || '',
      status: p.status,
      feedId: p.feedId || '',
    })

    setShowForm(true)
  }

  if (!can('podcasts:read')) {
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
            Podcasts
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Gestion des podcasts et épisodes.
          </p>
        </div>

        <div className="flex gap-2">
          {feeds.length > 0 && can('feeds:sync') && (
            <button
              onClick={importFromRss}
              className="flex items-center gap-2 rounded-lg bg-[#00209F] px-4 py-2 text-xs font-bold text-white hover:bg-[#001a7a]"
            >
              <Rss className="h-3.5 w-3.5" />
              Importer RSS
            </button>
          )}

          {can('podcasts:create') && (
            <button
              onClick={openNew}
              className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2 text-xs font-bold text-white hover:bg-[#b00d2b]"
            >
              <Plus className="h-3.5 w-3.5" />
              Nouveau podcast
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="col-span-full text-neutral-400">
            Chargement…
          </p>
        ) : podcasts.length === 0 ? (
          <p className="col-span-full text-neutral-400">
            Aucun podcast.
          </p>
        ) : (
          podcasts.map((p) => (
            <div
              key={p.id}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className="relative aspect-square bg-neutral-100">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-neutral-300">
                    <Headphones className="h-12 w-12" />
                  </div>
                )}

                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={cn(
                      'rounded-full p-1.5 text-white shadow',
                      p.status === 'PUBLISHED'
                        ? 'bg-green-600'
                        : 'bg-neutral-600'
                    )}
                    title={
                      p.status === 'PUBLISHED'
                        ? 'Dépublier'
                        : 'Publier'
                    }
                  >
                    {p.status === 'PUBLISHED' ? (
                      <Eye className="h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-neutral-900">
                      {p.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      {p.episodeCount ?? 0} épisode(s) •{' '}
                      {p.category || 'Sans catégorie'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1">
                  <Link
                    to={`/admin/podcasts/${p.id}/episodes`}
                    className="flex-1 rounded-lg bg-neutral-100 py-1.5 text-center text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                  >
                    Épisodes
                  </Link>

                  {can('podcasts:update') && (
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}

                  {can('podcasts:delete') && (
                    <button
                      onClick={() => deletePodcast(p.id)}
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-red-50 hover:text-[#D21034]"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="font-editorial text-lg font-black text-neutral-950">
              {editing ? 'Modifier' : 'Nouveau'} podcast
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Titre"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    title: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
              />

              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url"
                  placeholder="URL du fichier audio"
                  value={form.audioUrl}
                  onChange={(e) => setForm((f) => ({ ...f, audioUrl: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
                <input
                  placeholder="Durée (ex. 24 min)"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      imageUrl: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />

                <input
                  placeholder="Catégorie"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Auteur"
                  value={form.author}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      author: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                />

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as Podcast['status'],
                    }))
                  }
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
                >
                  <option value="DRAFT">Brouillon</option>
                  <option value="PUBLISHED">Publié</option>
                  <option value="ARCHIVED">Archivé</option>
                </select>
              </div>

              <select
                value={form.feedId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    feedId: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-[#D21034]"
              >
                <option value="">Aucun flux RSS lié</option>

                {feeds.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditing(null)
                  }}
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