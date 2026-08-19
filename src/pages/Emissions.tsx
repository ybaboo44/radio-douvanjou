import { CalendarDays, Clock, Mic2, User } from 'lucide-react'
import { useData } from '@/store/DataContext'
import { formatDate } from '@/data'

export default function Emissions() {
  const { shows } = useData()

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 border-[#D21034] pb-4">
        <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Émissions</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Les rendez-vous de Radio Douvanjou Media : information, débats, culture, sport et musique.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {shows.map((s) => (
          <article
            key={s.id}
            className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg md:grid-cols-3"
          >
            <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
              <img src={s.image} alt={s.name} className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute left-4 top-4 rounded bg-[#00209F] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                {s.category}
              </span>
            </div>
            <div className="p-6 md:col-span-2">
              <h2 className="font-editorial text-2xl font-black text-neutral-950">{s.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#D21034]" /> {s.host}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#D21034]" /> {s.schedule}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mic2 className="h-3.5 w-3.5 text-[#D21034]" /> {s.episodes.length} épisodes récents
                </span>
              </div>

              <div className="mt-5 border-t border-neutral-100 pt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Derniers épisodes</span>
                <ul className="mt-2 space-y-2">
                  {s.episodes.map((ep) => (
                    <li
                      key={ep.id}
                      className="flex items-center justify-between gap-4 rounded-lg bg-neutral-50 px-4 py-2.5 text-sm"
                    >
                      <span className="line-clamp-1 font-medium text-neutral-800">{ep.title}</span>
                      <span className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
                        <span>{formatDate(ep.date)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ep.duration}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
