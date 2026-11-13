import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import type { Podcast, PodcastEpisode } from '@/types/admin'

type EpisodeForm = {
  title: string
  description: string
  audioUrl: string
  duration: string
  publishedAt: string
  status: PodcastEpisode['status']
}

const EMPTY_FORM: EpisodeForm = {
  title: '',
  description: '',
  audioUrl: '',
  duration: '',
  publishedAt: '',
  status: 'DRAFT',
}

export default function AdminPodcastEpisodes() {
  const { id } = useParams()
  const { can } = useAuth()
  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [form, setForm] = useState<EpisodeForm>(EMPTY_FORM)
  const [editing, setEditing] = useState<PodcastEpisode | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadEpisodes = useCallback(async () => {
    if (!id) throw new Error('Identifiant du podcast manquant.')
    const [podcastResponse, episodesResponse] = await Promise.all([
      fetch(`/api/admin/podcasts/${id}`, { credentials: 'same-origin', cache: 'no-store' }),
      fetch(`/api/admin/podcasts/${id}/episodes`, { credentials: 'same-origin', cache: 'no-store' }),
    ])
    if (!podcastResponse.ok || !episodesResponse.ok) {
      const failedResponse = !podcastResponse.ok ? podcastResponse : episodesResponse
      const body = await failedResponse.json().catch(() => null) as { error?: string } | null
      throw new Error(body?.error || `Erreur HTTP ${failedResponse.status}`)
    }
    const [remotePodcast, remoteEpisodes] = await Promise.all([
      podcastResponse.json() as Promise<Podcast>,
      episodesResponse.json() as Promise<PodcastEpisode[]>,
    ])
    return {
      podcast: remotePodcast,
      episodes: Array.isArray(remoteEpisodes) ? remoteEpisodes : [],
    }
  }, [id])

  useEffect(() => {
    let active = true
    loadEpisodes()
      .then(({ podcast: loadedPodcast, episodes: loadedEpisodes }) => {
        if (!active) return
        setPodcast(loadedPodcast)
        setEpisodes(loadedEpisodes)
      })
      .catch((loadError: unknown) => {
        console.error('Erreur lors du chargement des épisodes :', loadError)
        if (active) setError(loadError instanceof Error ? loadError.message : 'Impossible de charger les épisodes.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [loadEpisodes])

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY_FORM })
    setError('')
    setShowForm(true)
  }

  function openEdit(episode: PodcastEpisode) {
    setEditing(episode)
    setForm({
      title: episode.title,
      description: episode.description || '',
      audioUrl: episode.audioUrl,
      duration: episode.duration?.toString() || '',
      publishedAt: episode.publishedAt ? episode.publishedAt.slice(0, 10) : '',
      status: episode.status,
    })
    setError('')
    setShowForm(true)
  }

  async function submitEpisode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!id || saving) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(
        editing
          ? `/api/admin/podcasts/${id}/episodes/${editing.id}`
          : `/api/admin/podcasts/${id}/episodes`,
        {
          method: editing ? 'PUT' : 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            ...form,
            duration: form.duration ? Number(form.duration) : undefined,
            publishedAt: form.publishedAt || undefined,
          }),
        },
      )
      if (!response.ok) {
        const body = await response.json().catch(() => null) as { error?: string } | null
        throw new Error(body?.error || `Erreur HTTP ${response.status}`)
      }
      const { podcast: loadedPodcast, episodes: loadedEpisodes } = await loadEpisodes()
      setPodcast(loadedPodcast)
      setEpisodes(loadedEpisodes)
      setShowForm(false)
      setEditing(null)
      setForm({ ...EMPTY_FORM })
    } catch (saveError) {
      console.error('Erreur lors de l’enregistrement de l’épisode :', saveError)
      setError(saveError instanceof Error ? saveError.message : 'Impossible d’enregistrer cet épisode.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteEpisode(episode: PodcastEpisode) {
    if (!id || !confirm(`Supprimer « ${episode.title} » ?`)) return
    try {
      const response = await fetch(`/api/admin/podcasts/${id}/episodes/${episode.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      })
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
      const { podcast: loadedPodcast, episodes: loadedEpisodes } = await loadEpisodes()
      setPodcast(loadedPodcast)
      setEpisodes(loadedEpisodes)
    } catch (deleteError) {
      console.error('Erreur lors de la suppression de l’épisode :', deleteError)
      setError(deleteError instanceof Error ? deleteError.message : 'Impossible de supprimer cet épisode.')
    }
  }

  if (!can('podcasts:read')) {
    return <div className="py-20 text-center text-red-600">Accès interdit.</div>
  }

  return (
    <div className="w-full max-w-4xl">
      <Link to="/admin/podcasts" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#D21034]">
        <ArrowLeft className="h-4 w-4" /> Podcasts
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Épisodes</h1>
          <p className="mt-1 break-words text-sm text-neutral-500">{podcast?.title || 'Gestion des épisodes du podcast'}</p>
        </div>
        {can('podcasts:create') && (
          <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#b00d2b]">
            <Plus className="h-4 w-4" /> Ajouter un épisode
          </button>
        )}
      </div>

      {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {showForm && (
        <form onSubmit={submitEpisode} className="mt-5 space-y-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
          <h2 className="font-editorial text-lg font-bold">{editing ? 'Modifier l’épisode' : 'Nouvel épisode'}</h2>
          <input required maxLength={200} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Titre" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <textarea maxLength={5000} rows={3} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
          <label className="block text-xs font-bold uppercase text-neutral-500">
            URL du fichier audio
            <input required type="url" maxLength={2048} value={form.audioUrl} onChange={(event) => setForm((current) => ({ ...current, audioUrl: event.target.value }))} placeholder="https://" className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-normal normal-case" />
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-bold uppercase text-neutral-500">
              Durée (secondes)
              <input type="number" min="1" max="86400" value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold uppercase text-neutral-500">
              Date de publication
              <input type="date" value={form.publishedAt} onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-normal" />
            </label>
            <label className="text-xs font-bold uppercase text-neutral-500">
              Statut
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PodcastEpisode['status'] }))} className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-normal">
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
              </select>
            </label>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600">Annuler</button>
            <button disabled={saving} className="rounded-lg bg-[#D21034] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {loading ? <p className="text-sm text-neutral-400">Chargement…</p> : episodes.length === 0 ? (
          <p className="rounded-xl border border-neutral-200 bg-white p-5 text-sm text-neutral-500">Aucun épisode pour le moment.</p>
        ) : episodes.map((episode) => (
          <article key={episode.id} className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words font-bold text-neutral-900">{episode.title}</h3>
              <p className="mt-1 text-xs text-neutral-500">
                {episode.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                {episode.publishedAt ? ` · ${new Date(episode.publishedAt).toLocaleDateString('fr-FR')}` : ''}
                {episode.duration ? ` · ${Math.floor(episode.duration / 60)} min` : ''}
              </p>
              <a href={episode.audioUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-xs text-[#00209F] hover:underline">{episode.audioUrl}</a>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {can('podcasts:update') && <button onClick={() => openEdit(episode)} aria-label={`Modifier ${episode.title}`} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100"><Pencil className="h-4 w-4" /></button>}
              {can('podcasts:delete') && <button onClick={() => void deleteEpisode(episode)} aria-label={`Supprimer ${episode.title}`} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
