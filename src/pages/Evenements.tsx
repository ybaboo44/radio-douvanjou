import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import { useData } from '@/store/DataContext'
import { formatDate } from '@/data'

export default function Evenements() {
  const { events } = useData()
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 border-[#00209F] pb-4">
        <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Événements</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Festivals, concerts, matchs et rendez-vous culturels en Haïti et dans la diaspora.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((e) => {
          const d = new Date(e.date)
          return (
            <article
              key={e.id}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={e.image}
                  alt={e.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-lg bg-white px-3 py-2 text-center shadow">
                  <div className="font-editorial text-xl font-black leading-none text-[#D21034]">{d.getDate()}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                    {d.toLocaleDateString('fr-FR', { month: 'short' })}
                  </div>
                </div>
                <span className="absolute right-4 top-4 rounded bg-[#00209F] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                  {e.category}
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-editorial text-xl font-bold leading-snug text-neutral-950">{e.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{e.description}</p>
                <div className="mt-4 space-y-1.5 text-xs text-neutral-600">
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-[#D21034]" /> {formatDate(e.date)} · {e.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#D21034]" /> {e.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Ticket className="h-3.5 w-3.5 text-[#D21034]" /> {e.price}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
