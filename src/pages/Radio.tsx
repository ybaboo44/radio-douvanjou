import { Pause, Play, Radio as RadioIcon, Volume2, VolumeX, Clock } from 'lucide-react'
import { usePlayer } from '@/store/PlayerContext'
import { STREAMS } from '@/config'
import { radioSchedule } from '@/data'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export default function Radio() {
  const player = usePlayer()
  const isThisLive = player.track?.isLive === true
  const playing = isThisLive && player.playing

  const currentShow = radioSchedule.find((s) => s.live) ?? radioSchedule[0]
  const currentIndex = radioSchedule.indexOf(currentShow)
  const nextShow = radioSchedule[currentIndex + 1]

  const toggleLive = () => {
    player.playTrack({
      title: STREAMS.radio.mountName,
      subtitle: `En ce moment : ${currentShow.show} — ${currentShow.host}`,
      url: STREAMS.radio.url,
      isLive: true,
    })
  }

  return (
    <div>
      {/* Hero lecteur */}
      <section className="bg-neutral-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#5B7FE8]">
                <RadioIcon className="h-4 w-4" /> {STREAMS.radio.mountName}
              </span>
              <h1 className="font-editorial mt-3 text-4xl font-black md:text-5xl">Radio en direct</h1>
              <p className="mt-4 max-w-lg text-neutral-400">
                Information continue, débats, culture et musique haïtienne — 24h/24, partout dans le monde. Le flux est
                configurable dans <code className="rounded bg-neutral-800 px-1.5 py-0.5 text-xs">src/config.ts</code>.
              </p>

              {/* Lecteur */}
              <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 rounded bg-[#D21034] px-2.5 py-1 text-xs font-black uppercase">
                    <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" /> En direct
                  </span>
                  <span className="text-xs text-neutral-400">Streaming · 128 kbps</span>
                </div>

                <div className="mt-6 flex items-center gap-5">
                  <button
                    onClick={toggleLive}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#D21034] shadow-lg transition hover:scale-105 hover:bg-[#b00d2b]"
                    aria-label={playing ? 'Pause' : 'Écouter le direct'}
                  >
                    {playing ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">En ce moment</div>
                    <div className="font-editorial truncate text-xl font-bold">{currentShow.show}</div>
                    <div className="truncate text-sm text-neutral-400">{currentShow.host}</div>
                  </div>
                </div>

                {/* Visualiseur animé */}
                <div className="mt-6 flex h-10 items-end gap-1">
                  {Array.from({ length: 40 }, (_, i) => (
                    <span
                      key={i}
                      className={cn('w-full rounded-sm bg-[#D21034]/70 transition-all', playing ? 'rdm-live-dot' : 'opacity-30')}
                      style={{
                        height: `${20 + Math.abs(Math.sin(i * 1.7)) * 80}%`,
                        animationDelay: `${i * 0.05}s`,
                      }}
                    />
                  ))}
                </div>

                {/* Volume */}
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={player.toggleMute} className="text-neutral-300 hover:text-white" aria-label="Muet">
                    {player.muted || player.volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                  <Slider
                    value={[player.muted ? 0 : player.volume * 100]}
                    max={100}
                    onValueChange={([v]) => player.setVolume(v / 100)}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </div>

            {/* Maintenant / Ensuite */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#D21034]/40 bg-gradient-to-br from-[#D21034]/20 to-transparent p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8FA3]">Émission actuelle</span>
                <h2 className="font-editorial mt-2 text-2xl font-bold">{currentShow.show}</h2>
                <p className="mt-1 text-sm text-neutral-300">{currentShow.host}</p>
                <p className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                  <Clock className="h-3.5 w-3.5" /> {currentShow.time}
                </p>
              </div>
              {nextShow && (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Prochaine émission</span>
                  <h3 className="font-editorial mt-2 text-xl font-bold">{nextShow.show}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{nextShow.host}</p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                    <Clock className="h-3.5 w-3.5" /> {nextShow.time}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Programmation */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="font-editorial border-b-2 border-[#D21034] pb-3 text-2xl font-black text-neutral-950 md:text-3xl">
          Programmation du jour
        </h2>
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200">
          {radioSchedule.map((slot) => (
            <div
              key={slot.time}
              className={cn(
                'flex flex-col gap-1 border-b border-neutral-100 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between',
                slot.live && 'bg-red-50',
              )}
            >
              <div className="flex items-center gap-3">
                {slot.live && (
                  <span className="flex items-center gap-1.5 rounded bg-[#D21034] px-2 py-0.5 text-[10px] font-black uppercase text-white">
                    <span className="rdm-live-dot inline-block h-1.5 w-1.5 rounded-full bg-white" /> Direct
                  </span>
                )}
                <span className="font-editorial text-base font-bold text-neutral-950">{slot.show}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-600">
                <span>{slot.host}</span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold">{slot.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
