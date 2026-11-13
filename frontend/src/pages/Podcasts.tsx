import { useEffect, useState } from 'react'
import { Pause, Play, Rss } from 'lucide-react'
import { useData } from '@/store/useData'
import { usePlayer } from '@/store/player-context'
import { formatDate, type Podcast as PublicPodcast } from '@/data'
import { useSiteSettings } from '@/store/useSiteSettings'
import { getSettingValue } from '@/store/site-settings-utils'

export default function Podcasts() {
  const { podcasts } = useData()
  const player = usePlayer()
  const [adminPodcasts, setAdminPodcasts] = useState<PublicPodcast[]>([])
  const { settings } = useSiteSettings()
  const podcastDescription = getSettingValue(settings, 'podcast.description')
  const podcastFeedUrl = getSettingValue(settings, 'podcast.feedUrl')

  useEffect(() => {
    let active = true
    fetch('/api/public/podcasts', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<PublicPodcast[]>
      })
      .then((results) => {
        if (active && Array.isArray(results)) setAdminPodcasts(results)
      })
      .catch((error: unknown) => console.error('Erreur lors du chargement des podcasts publiés :', error))
    return () => {
      active = false
    }
  }, [])

  const podcastList = [
    ...adminPodcasts,
    ...podcasts.filter((podcast) => !adminPodcasts.some((adminPodcast) => adminPodcast.id === podcast.id)),
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#D21034] pb-4">
        <div>
          <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Podcasts</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {podcastDescription}
          </p>
        </div>
        {podcastFeedUrl ? (
          <a
            href={podcastFeedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-200"
          >
            <Rss className="h-3.5 w-3.5 text-[#E07B00]" /> Ouvrir le flux RSS
          </a>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-600">
            <Rss className="h-3.5 w-3.5 text-[#E07B00]" /> Flux RSS — bientôt disponible
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {podcastList.map((p) => {
          const isCurrent = player.track?.url === p.audioUrl
          const isPlaying = isCurrent && player.playing
          return (
            <article
              key={p.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
                <button
                  onClick={() =>
                    player.playTrack({
                      title: p.title,
                      subtitle: `${p.show} · ${p.duration}`,
                      url: p.audioUrl,
                      cover: p.cover,
                    })
                  }
                  className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D21034] text-white shadow-xl transition hover:scale-105"
                  aria-label={isPlaying ? 'Pause' : 'Écouter'}
                  disabled={!p.audioUrl}
                  title={p.audioUrl ? 'Écouter' : 'Aucun fichier audio associé'}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
                </button>
                <span className="absolute left-4 top-4 rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00209F]">{p.show}</span>
                <h2 className="mt-1 line-clamp-2 font-editorial text-lg font-bold leading-snug text-neutral-950">
                  {p.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{p.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-500">
                  <span>{formatDate(p.date)}</span>
                  {p.duration && <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-semibold">{p.duration}</span>}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
