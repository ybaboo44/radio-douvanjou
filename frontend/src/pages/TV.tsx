import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Hls from 'hls.js'
import {
  AlertCircle,
  Clock,
  Loader2,
  Play,
  Radio,
  Tv as TvIcon,
} from 'lucide-react'

import { STREAMS } from '@/config'
import { formatDate, formatViews, videos } from '@/data'
import { useSiteSettings } from '@/store/useSiteSettings'
import { getSettingValue } from '@/store/site-settings-utils'

type PlayerState = 'idle' | 'loading' | 'playing' | 'error'

export default function TV() {
  const { settings } = useSiteSettings()
  const tvName = getSettingValue(settings, 'tv.name') || STREAMS.tv.channelName
  const tvUrl = getSettingValue(settings, 'tv.url') || STREAMS.tv.url
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [playerState, setPlayerState] = useState<PlayerState>('idle')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return

    const video = videoRef.current

    if (!video) return

    let mounted = true

    const startStream = async () => {
      setPlayerState('loading')

      const handleFatalError = () => {
        if (mounted) {
          setPlayerState('error')
        }
      }

      /*
       * HLS.js
       */
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          maxBufferLength: 20,
        })

        hlsRef.current = hls

        hls.loadSource(tvUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (!mounted) return

          setPlayerState('playing')

          video
            .play()
            .catch(() => {
              if (mounted) {
                setPlayerState('playing')
              }
            })
        })

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (!mounted || !data.fatal) return

          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad()
              break

            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break

            default:
              hls.destroy()
              hlsRef.current = null
              handleFatalError()
              break
          }
        })

        return
      }

      /*
       * Safari / navigateurs avec support HLS natif
       */
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = tvUrl

        const handleLoadedMetadata = () => {
          if (!mounted) return

          setPlayerState('playing')

          video
            .play()
            .catch(() => {
              if (mounted) {
                setPlayerState('playing')
              }
            })
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)

        video.addEventListener('error', handleFatalError)

        return () => {
          video.removeEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
          )

          video.removeEventListener('error', handleFatalError)
        }
      }

      handleFatalError()
    }

    startStream()

    return () => {
      mounted = false

      hlsRef.current?.destroy()
      hlsRef.current = null

      video.pause()
      video.removeAttribute('src')
      video.load()
    }
  }, [started, tvUrl])

  const handleStart = () => {
    setStarted(true)
    setPlayerState('loading')
  }

  const handleRetry = () => {
    hlsRef.current?.destroy()
    hlsRef.current = null

    setPlayerState('idle')
    setStarted(false)

    window.setTimeout(() => {
      setStarted(true)
      setPlayerState('loading')
    }, 100)
  }

  return (
    <main className="min-h-screen bg-white">

      {/* =========================================================
          HERO TV
      ========================================================== */}
      <section className="bg-neutral-950 text-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">

          <div className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[3px] w-10 bg-[#D21034]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50">
                  Radio Douvanjou Media
                </span>

              </div>

              <div className="mt-4 flex items-center gap-3">

                <TvIcon className="h-7 w-7 text-[#D21034]" />

                <span className="text-sm font-bold uppercase tracking-wider text-white/70">
                  {tvName}
                </span>

              </div>

              <h1 className="mt-2 font-editorial text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                TV en direct
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
                Regardez Radio Douvanjou Media en direct et retrouvez
                nos programmes, nos émissions et toute notre actualité.
              </p>

            </div>

            {/* LIVE BADGE */}
            <div className="flex shrink-0 items-center">

              <span className="inline-flex items-center gap-2 bg-[#D21034] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">

                <span
                  className="h-2 w-2 animate-pulse rounded-full bg-white"
                  aria-hidden="true"
                />

                En direct

              </span>

            </div>

          </div>

          {/* =====================================================
              PLAYER
          ====================================================== */}
          <div className="mt-8">

            <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black shadow-2xl">

              {!started && (

                <button
                  type="button"
                  onClick={handleStart}
                  aria-label={`Lancer le direct ${tvName}`}
                  className="group absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black transition hover:bg-neutral-900"
                >

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D21034] shadow-2xl transition duration-300 group-hover:scale-110 group-focus-visible:scale-110 sm:h-24 sm:w-24">

                    <Play
                      className="ml-1 h-8 w-8 fill-current text-white sm:h-10 sm:w-10"
                      aria-hidden="true"
                    />

                  </div>

                  <span className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white">
                    Lancer le direct
                  </span>

                  <span className="mt-2 text-xs text-white/40">
                    {tvName}
                  </span>

                </button>

              )}

              {started && (

                <>
                  <video
                    ref={videoRef}
                    controls
                    playsInline
                    preload="none"
                    className="h-full w-full bg-black object-contain"
                    aria-label={`Flux TV en direct de ${tvName}`}
                  />

                  {/* LOADING */}
                  {playerState === 'loading' && (

                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
                      aria-live="polite"
                    >

                      <Loader2 className="h-10 w-10 animate-spin text-[#D21034]" />

                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-white">
                        Connexion au direct
                      </p>

                      <p className="mt-2 text-xs text-white/40">
                        Chargement du flux TV...
                      </p>

                    </div>

                  )}

                  {/* ERROR */}
                  {playerState === 'error' && (

                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 px-6 text-center"
                      role="alert"
                    >

                      <div className="flex h-14 w-14 items-center justify-center border border-[#D21034]/30 bg-[#D21034]/10">

                        <AlertCircle className="h-7 w-7 text-[#D21034]" />

                      </div>

                      <h2 className="mt-5 text-lg font-bold text-white">
                        Le direct est momentanément indisponible
                      </h2>

                      <p className="mt-2 max-w-md text-xs leading-5 text-white/50">
                        Nous rencontrons actuellement un problème avec
                        le flux TV. Veuillez réessayer dans quelques instants.
                      </p>

                      <button
                        type="button"
                        onClick={handleRetry}
                        className="mt-5 bg-[#D21034] px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition hover:bg-[#b00d2b]"
                      >
                        Réessayer
                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

          </div>

          {/* =====================================================
              PROGRAMMATION
          ====================================================== */}
          <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">

            {/* CURRENT */}
            <div className="bg-[#D21034] p-6 sm:p-7">

              <div className="flex items-center justify-between gap-4">

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                  À l'antenne
                </span>

                <Radio
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                />

              </div>

              <h2 className="mt-3 font-editorial text-2xl font-black text-white">
                Le Grand Journal
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/80">

                <Clock className="h-3.5 w-3.5" />

                <span>
                  19h00 – 20h00
                </span>

              </div>

              <p className="mt-2 text-xs text-white/60">
                Avec la rédaction RDM
              </p>

            </div>

            {/* NEXT */}
            <div className="bg-neutral-900 p-6 sm:p-7">

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                Prochainement
              </span>

              <h2 className="mt-3 font-editorial text-2xl font-black text-white">
                Magazine Culture
              </h2>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/50">

                <Clock className="h-3.5 w-3.5" />

                <span>
                  20h00 – 21h00
                </span>

              </div>

              <p className="mt-2 text-xs text-white/40">
                Avec N. C. François
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =========================================================
          DERNIÈRES VIDÉOS
      ========================================================== */}
      <section className="bg-white">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">

          <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="h-[3px] w-8 bg-[#D21034]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Vidéo
                </span>

              </div>

              <h2 className="mt-2 font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">
                Dernières vidéos
              </h2>

            </div>

            <Link
              to="/videos"
              className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.15em] text-neutral-600 transition hover:text-[#D21034]"
            >
              Toutes les vidéos
              <span className="ml-2 text-base" aria-hidden="true">
                →
              </span>
            </Link>

          </div>

          {/* VIDEO GRID */}
          <div className="mt-7 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">

            {videos.slice(0, 4).map((video) => (

              <Link
                key={video.id}
                to="/videos"
                className="group block"
                aria-label={`Voir la vidéo : ${video.title}`}
              >

                {/* THUMBNAIL */}
                <div className="relative aspect-video overflow-hidden bg-neutral-200">

                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

                  {/* PLAY */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">

                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D21034] shadow-xl">

                      <Play
                        className="ml-0.5 h-5 w-5 fill-current text-white"
                        aria-hidden="true"
                      />

                    </span>

                  </div>

                  {/* DURATION */}
                  <span className="absolute bottom-2 right-2 bg-black/85 px-2 py-1 text-[10px] font-bold text-white">
                    {video.duration}
                  </span>

                </div>

                {/* CATEGORY */}
                <span className="mt-3 block text-[9px] font-black uppercase tracking-[0.18em] text-[#D21034]">
                  {video.category}
                </span>

                {/* TITLE */}
                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-neutral-950 transition-colors group-hover:text-[#D21034]">
                  {video.title}
                </h3>

                {/* META */}
                <p className="mt-2 text-[10px] text-neutral-500">
                  {formatDate(video.date)}
                  <span className="mx-1.5 text-neutral-300">·</span>
                  {formatViews(video.views)} vues
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* =========================================================
          CTA RADIO
      ========================================================== */}
      <section className="border-t border-neutral-200 bg-neutral-50">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <Radio className="h-5 w-5 text-[#D21034]" />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  Radio Douvanjou Media
                </span>

              </div>

              <h2 className="mt-2 font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
                Écoutez également la radio en direct
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                Retrouvez vos émissions, l'information et vos programmes
                préférés sur notre antenne radio.
              </p>

            </div>

            <Link
              to="/radio"
              className="inline-flex w-fit shrink-0 items-center gap-2 bg-neutral-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-[#D21034]"
            >
              <Radio className="h-4 w-4" />
              Écouter la radio
            </Link>

          </div>

        </div>

      </section>

    </main>
  )
}