import { Link } from 'react-router'
import {
  Newspaper,
  Clapperboard,
  Podcast,
  Mic2,
  CalendarDays,
  Users,
  Eye,
  Radio,
  Tv,
  TrendingUp,
  PlusCircle,
} from 'lucide-react'
import { useData } from '@/store/DataContext'
import { formatDate } from '@/data'

export default function Dashboard() {
  const { articles, videos, podcasts, shows, events } = useData()

  const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
  const visitors = Math.round(totalViews * 0.62)

  const stats = [
    { label: 'Articles', value: articles.length, icon: Newspaper, to: '/admin/articles', color: '#D21034' },
    { label: 'Vidéos', value: videos.length, icon: Clapperboard, to: '/admin/videos', color: '#00209F' },
    { label: 'Podcasts', value: podcasts.length, icon: Podcast, to: '/admin/podcasts', color: '#E07B00' },
    { label: 'Émissions', value: shows.length, icon: Mic2, to: '/admin/emissions', color: '#7C3AED' },
    { label: 'Événements', value: events.length, icon: CalendarDays, to: '/admin/evenements', color: '#0F7B3D' },
    { label: 'Visiteurs (mois)', value: visitors.toLocaleString('fr-FR'), icon: Users, to: '/admin', color: '#0E7490' },
    { label: 'Vues totales', value: totalViews.toLocaleString('fr-FR'), icon: Eye, to: '/admin', color: '#334155' },
  ]

  const recent = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Dashboard</h1>
          <p className="text-sm text-neutral-500">Vue d'ensemble de la plateforme Radio Douvanjou Media.</p>
        </div>
        <Link
          to="/admin/articles/nouveau"
          className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b]"
        >
          <PlusCircle className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      {/* Statut des directs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#D21034]/10 text-[#D21034]">
              <Radio className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-neutral-950">Radio Live</div>
              <div className="text-xs text-neutral-500">94.5 FM · Port-au-Prince</div>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-green-600" /> En ligne
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#00209F]/10 text-[#00209F]">
              <Tv className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-neutral-950">TV Live</div>
              <div className="text-xs text-neutral-500">Douvanjou TV · HLS</div>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-green-600" /> En ligne
          </span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-xl border border-neutral-200 bg-white p-5 transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${s.color}1A`, color: s.color }}
              >
                <s.icon className="h-5 w-5" />
              </span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="mt-3 font-editorial text-2xl font-black text-neutral-950">{s.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Articles récents */}
      <div className="mt-8 rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <h2 className="font-editorial text-lg font-black text-neutral-950">Articles récents</h2>
          <Link to="/admin/articles" className="text-xs font-bold uppercase tracking-wider text-[#D21034]">
            Tout gérer
          </Link>
        </div>
        <div className="divide-y divide-neutral-100">
          {recent.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3.5">
              <img src={a.image} alt="" className="h-11 w-16 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-sm font-semibold text-neutral-900">{a.title}</div>
                <div className="text-xs text-neutral-500">{formatDate(a.publishedAt)}</div>
              </div>
              <span
                className={
                  a.status === 'publie'
                    ? 'rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700'
                    : 'rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700'
                }
              >
                {a.status === 'publie' ? 'Publié' : 'Brouillon'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Étape 1 (MVP) : les contenus sont stockés dans le navigateur (localStorage). À l'Étape 2, cette console sera
        connectée à PostgreSQL avec authentification et permissions.
      </p>
    </div>
  )
}
