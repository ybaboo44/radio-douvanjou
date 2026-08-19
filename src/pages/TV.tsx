import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Hls from 'hls.js'
import { AlertCircle, Clock, Play, Tv as TvIcon } from 'lucide-react'
import { STREAMS } from '@/config'
import { formatDate, formatViews, videos } from '@/data'

export default function TV() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true })
      hls.loadSource(STREAMS.tv.url)
      hls.attachMedia(video)
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError(true)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAMS.tv.url
    } else {
      setError(true)
    }
    video.play().catch(() => {})

    return () => {
      hls?.destroy()
    }
  }, [started])

  return (
    <div>
      <section className="bg-neutral-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#5B7FE8]">
                <TvIcon className="h-4 w-4" /> {STREAMS.tv.channelName}
              </span>
              <h1 className="font-editorial mt-2 text-4xl font-black md:text-5xl">TV en direct</h1>
            </div>
            <span className="flex items-center gap-2 rounded bg-[#D21034] px-3 py-1.5 text-xs font-black uppercase">
              <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" /> En direct
            </span>
          </div>

          {/* Lecteur HLS */}
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-neutral-800 bg-black">
            {!started ? (
              <button
                onClick={() => setStarted(true)}
                className="group absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D21034] shadow-2xl transition group-hover:scale-110">
                  <Play className="ml-1 h-9 w-9" />
                </span>
                <span className="text-sm font-semibold text-neutral-300">Lancer le direct {STREAMS.tv.channelName}</span>
              </button>
            ) : (
              <video ref={videoRef} controls className="h-full w-full" playsInline />
            )}
            {error && started && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900/95 p-6 text-center">
                <AlertCircle className="h-10 w-10 text-[#D21034]" />
                <p className="max-w-md text-sm text-neutral-300">
                  Le flux TV est momentanément indisponible. Vérifiez l'URL du flux HLS dans{' '}
                  <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs">src/config.ts</code>.
                </p>
              </div>
            )}
          </div>

          {/* Maintenant / Ensuite */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#D21034]/40 bg-gradient-to-br from-[#D21034]/20 to-transparent p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF8FA3]">Émission actuelle</span>
              <h2 className="font-editorial mt-1 text-xl font-bold">Le Grand Journal</h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-neutral-400">
                <Clock className="h-3.5 w-3.5" /> 19h00 – 20h00 · Avec la rédaction RDM
              </p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Prochaine émission</span>
              <h3 className="font-editorial mt-1 text-xl font-bold">Magazine Culture</h3>
              <p className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                <Clock className="h-3.5 w-3.5" /> 20h00 – 21h00 · Avec N. C. François
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dernières vidéos */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-end justify-between border-b-2 border-[#D21034] pb-3">
          <h2 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Dernières vidéos</h2>
          <Link to="/videos" className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-[#D21034]">
            Toutes les vidéos
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.slice(0, 4).map((v) => (
            <Link key={v.id} to="/videos" className="group">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {v.duration}
                </span>
                <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D21034]/90">
                    <Play className="ml-0.5 h-5 w-5 text-white" />
                  </span>
                </span>
              </div>
              <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-[#D21034]">{v.category}</span>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-neutral-950 group-hover:text-[#D21034]">
                {v.title}
              </h3>
              <span className="mt-1 block text-xs text-neutral-500">
                {formatDate(v.date)} · {formatViews(v.views)} vues
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
