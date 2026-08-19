import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Pause, Play, Radio, Volume2, VolumeX, X } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

export interface PlayerTrack {
  title: string
  subtitle: string
  url: string
  isLive?: boolean
  cover?: string
}

interface PlayerContextValue {
  track: PlayerTrack | null
  playing: boolean
  volume: number
  muted: boolean
  playTrack: (t: PlayerTrack) => void
  toggle: () => void
  setVolume: (v: number) => void
  toggleMute: () => void
  stop: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = useState<PlayerTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio
    const onEnd = () => setPlaying(false)
    const onError = () => setPlaying(false)
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  const value = useMemo<PlayerContextValue>(
    () => ({
      track,
      playing,
      volume,
      muted,
      playTrack: (t) => {
        const audio = audioRef.current
        if (!audio) return
        if (track?.url === t.url) {
          if (audio.paused) {
            audio.play().catch(() => setPlaying(false))
            setPlaying(true)
          } else {
            audio.pause()
            setPlaying(false)
          }
          return
        }
        audio.src = t.url
        audio.volume = muted ? 0 : volume
        audio.play().catch(() => setPlaying(false))
        setTrack(t)
        setPlaying(true)
      },
      toggle: () => {
        const audio = audioRef.current
        if (!audio || !track) return
        if (audio.paused) {
          audio.play().catch(() => setPlaying(false))
          setPlaying(true)
        } else {
          audio.pause()
          setPlaying(false)
        }
      },
      setVolume: (v) => {
        setVolumeState(v)
        if (v > 0) setMuted(false)
      },
      toggleMute: () => setMuted((m) => !m),
      stop: () => {
        const audio = audioRef.current
        if (audio) {
          audio.pause()
          audio.removeAttribute('src')
          audio.load()
        }
        setTrack(null)
        setPlaying(false)
      },
    }),
    [track, playing, volume, muted],
  )

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <MiniPlayer />
    </PlayerContext.Provider>
  )
}

function MiniPlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx || !ctx.track) return null
  const { track, playing, volume, muted } = ctx

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-800 bg-neutral-950 text-white shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        {track.cover ? (
          <img src={track.cover} alt="" className="h-10 w-10 rounded object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-[#D21034]">
            <Radio className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {track.isLive && (
              <span className="flex items-center gap-1 rounded bg-[#D21034] px-1.5 py-0.5 text-[10px] font-black uppercase">
                <span className="rdm-live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" />
                Direct
              </span>
            )}
            <span className="truncate text-sm font-bold">{track.title}</span>
          </div>
          <span className="block truncate text-xs text-neutral-400">{track.subtitle}</span>
        </div>
        <button
          onClick={ctx.toggle}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 transition hover:bg-neutral-200"
          aria-label={playing ? 'Pause' : 'Lecture'}
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <button onClick={ctx.toggleMute} aria-label="Muet" className="text-neutral-300 hover:text-white">
            {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <Slider
            value={[muted ? 0 : volume * 100]}
            max={100}
            onValueChange={([v]) => ctx.setVolume(v / 100)}
            className="w-24"
          />
        </div>
        {track.isLive && (
          <Link to="/radio" className="hidden text-xs font-semibold text-neutral-400 hover:text-white md:block">
            Ouvrir la radio
          </Link>
        )}
        <button onClick={ctx.stop} aria-label="Fermer" className="text-neutral-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer doit être utilisé dans un PlayerProvider')
  return ctx
}
