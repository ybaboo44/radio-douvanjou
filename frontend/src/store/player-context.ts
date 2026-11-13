import { createContext, useContext } from 'react'

export interface PlayerTrack {
  title: string
  subtitle: string
  url: string
  isLive?: boolean
  cover?: string
}

export interface PlayerContextValue {
  track: PlayerTrack | null
  playing: boolean
  volume: number
  muted: boolean
  playTrack: (track: PlayerTrack) => void
  toggle: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  stop: () => void
}

export const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer(): PlayerContextValue {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer doit être utilisé dans un PlayerProvider')
  return context
}
