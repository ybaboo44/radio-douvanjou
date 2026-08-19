import { useMemo } from 'react'
import { Radio, Tv, CheckCircle2 } from 'lucide-react'
import { SITE, STREAMS } from '@/config'
import { useData } from '@/store/DataContext'

export function AdminStream({ type }: { type: 'radio' | 'tv' }) {
  const isRadio = type === 'radio'
  const conf = isRadio ? STREAMS.radio : STREAMS.tv
  const name = isRadio ? (conf as typeof STREAMS.radio).mountName : (conf as typeof STREAMS.tv).channelName

  return (
    <div className="max-w-3xl">
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
        {isRadio ? 'Radio — flux en direct' : 'TV — flux en direct'}
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Configuration du flux {isRadio ? 'audio' : 'vidéo HLS'} diffusé sur la page publique.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${
              isRadio ? 'bg-[#D21034]/10 text-[#D21034]' : 'bg-[#00209F]/10 text-[#00209F]'
            }`}
          >
            {isRadio ? <Radio className="h-6 w-6" /> : <Tv className="h-6 w-6" />}
          </span>
          <div>
            <div className="font-bold text-neutral-950">{name}</div>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Flux configuré
            </span>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
            URL du flux {isRadio ? '(MP3 / AAC / HLS)' : '(HLS .m3u8)'}
          </label>
          <code className="block w-full overflow-x-auto rounded-lg bg-neutral-950 px-4 py-3 text-xs text-green-400">
            {conf.url}
          </code>
          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            Étape 1 (MVP) : l'URL est centralisée dans <code className="rounded bg-neutral-100 px-1">src/config.ts</code>{' '}
            (objet <code className="rounded bg-neutral-100 px-1">STREAMS</code>). À l'Étape 2, elle sera modifiable ici
            et stockée en base PostgreSQL via les paramètres.
          </p>
        </div>
      </div>
    </div>
  )
}

export function AdminMedias() {
  const { articles, shows, videos, podcasts, events } = useData()
  const medias = useMemo(() => {
    const list: { url: string; label: string; type: string }[] = [
      ...articles.map((a) => ({ url: a.image, label: a.title, type: 'Article' })),
      ...shows.map((s) => ({ url: s.image, label: s.name, type: 'Émission' })),
      ...videos.map((v) => ({ url: v.thumbnail, label: v.title, type: 'Vidéo' })),
      ...podcasts.map((p) => ({ url: p.cover, label: p.title, type: 'Podcast' })),
      ...events.map((e) => ({ url: e.image, label: e.title, type: 'Événement' })),
    ]
    return list
  }, [articles, shows, videos, podcasts, events])

  return (
    <div>
      <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Médiathèque</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {medias.length} médias référencés. À l'Étape 2 : upload de fichiers protégé et stockage serveur.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {medias.map((m, i) => (
          <figure key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <img src={m.url} alt={m.label} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <figcaption className="p-3">
              <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase text-neutral-600">
                {m.type}
              </span>
              <div className="mt-1.5 line-clamp-1 text-xs font-semibold text-neutral-800">{m.label}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}