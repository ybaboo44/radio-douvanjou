import { useEffect, useMemo, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Play, X } from 'lucide-react'
import { useData } from '@/store/useData'
import { formatDate, formatViews, type Video } from '@/data'
import { cn } from '@/lib/utils'

const VIDEO_CATEGORIES = ['Tous', 'Reportages', 'Interviews', 'Débats', 'Documentaires', 'Émissions', 'Culture', 'Sport']

export default function Videos() {
  const { videos } = useData()
  const [cat, setCat] = useState('Tous')
  const [current, setCurrent] = useState<Video | null>(null)

  const filtered = useMemo(
    () => (cat === 'Tous' ? videos : videos.filter((v) => v.category === cat)),
    [videos, cat],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 border-[#D21034] pb-4">
        <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Vidéos</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Reportages, interviews, débats et documentaires de la rédaction. Compatible YouTube, Vimeo et vidéos hébergées
          (HLS).
        </p>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {VIDEO_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition',
              cat === c
                ? 'border-transparent bg-neutral-950 text-white'
                : 'border-neutral-300 text-neutral-700 hover:border-neutral-500',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v) => (
          <button key={v.id} onClick={() => setCurrent(v)} className="group text-left">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {v.duration}
              </span>
              <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-[#D21034] opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                  <Play className="ml-1 h-6 w-6 text-white" />
                </span>
              </span>
            </div>
            <span className="mt-3 block text-[10px] font-bold uppercase tracking-wider text-[#D21034]">{v.category}</span>
            <h3 className="mt-1 line-clamp-2 font-editorial text-lg font-bold leading-snug text-neutral-950 group-hover:text-[#D21034]">
              {v.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{v.description}</p>
            <span className="mt-2 block text-xs text-neutral-500">
              {formatDate(v.date)} · {formatViews(v.views)} vues
            </span>
          </button>
        ))}
      </div>

      {current && <VideoModal video={current} onClose={() => setCurrent(null)} />}
    </div>
  )
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let hls: Hls | null = null
    if (video.url.endsWith('.m3u8') && Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(video.url)
      hls.attachMedia(el)
    } else {
      el.src = video.url
    }
    el.play().catch(() => {})
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      hls?.destroy()
      window.removeEventListener('keydown', onKey)
    }
  }, [video, onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4 text-white">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8FA3]">{video.category}</span>
            <h2 className="font-editorial text-xl font-bold">{video.title}</h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 hover:bg-white/20" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <video ref={ref} controls playsInline className="aspect-video w-full rounded-xl bg-black" />
        <p className="mt-3 text-sm text-neutral-400">{video.description}</p>
      </div>
    </div>
  )
}
