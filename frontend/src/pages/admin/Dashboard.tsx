import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  Users,
  Newspaper,
  Mic2,
  Podcast,
  Rss,
  FileText,
  TrendingUp,
  Activity,
  PlusCircle,
} from 'lucide-react'
import { useData } from '@/store/useData'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/data'
import type { DashboardStats } from '@/types/admin'

export default function AdminDashboard() {
  const { can } = useAuth()
  const { articles, videos, podcasts, shows } = useData()
  const [serverStats, setServerStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/admin/stats', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<DashboardStats>
      })
      .then((stats) => {
        if (active) setServerStats(stats)
      })
      .catch((error: unknown) => console.error('Erreur lors du chargement des statistiques :', error))
    return () => {
      active = false
    }
  }, [])

  const publicationsCount = articles.length

  const stats = [
    {
      key: 'usersCount',
      label: 'Utilisateurs',
      value: serverStats?.usersCount ?? '—',
      icon: Users,
      color: 'bg-[#00209F]',
    },
    {
      key: 'contentsCount',
      label: 'Contenus',
      value: serverStats?.contentsCount ?? articles.length + videos.length + podcasts.length + shows.length,
      icon: FileText,
      color: 'bg-emerald-600',
    },
    {
      key: 'showsCount',
      label: 'Émissions',
      value: serverStats?.showsCount ?? shows.length,
      icon: Mic2,
      color: 'bg-amber-600',
    },
    {
      key: 'podcastsCount',
      label: 'Podcasts',
      value: serverStats?.podcastsCount ?? podcasts.length,
      icon: Podcast,
      color: 'bg-purple-600',
    },
    {
      key: 'feedsCount',
      label: 'Flux',
      value: serverStats?.feedsCount ?? '—',
      icon: Rss,
      color: 'bg-sky-600',
    },
    {
      key: 'publicationsCount',
      label: 'Publications',
      value: serverStats?.publicationsCount ?? publicationsCount,
      icon: Newspaper,
      color: 'bg-[#D21034]',
    },
  ] as const

  const recentActivity = [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() -
        new Date(a.publishedAt || 0).getTime()
    )
    .slice(0, 8)
    .map((a) => ({
      id: a.id,
      userName: 'Admin',
      action:
        a.status === 'publie'
          ? `a publié « ${a.title} »`
          : `a créé le brouillon « ${a.title} »`,
      createdAt: a.publishedAt,
    }))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">
            Tableau de bord
          </h1>

          <p className="text-sm text-neutral-500">
            Vue d'ensemble de la plateforme.
          </p>
        </div>

        <Link
          to="/admin/articles/nouveau"
          className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b]"
        >
          <PlusCircle className="h-4 w-4" />
          Nouvel article
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ key, label, value, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-black text-neutral-950">
                  {value}
                </div>

                <div className="mt-0.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {label}
                </div>
              </div>

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}
              >
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#D21034]" />

            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
              Activité récente
            </h2>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 && (
              <p className="text-sm text-neutral-400">
                Aucune activité récente.
              </p>
            )}

            {recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 text-sm"
              >
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D21034]" />

                <div>
                  <span className="font-semibold text-neutral-900">
                    {log.userName}
                  </span>{' '}

                  <span className="text-neutral-600">
                    {log.action}
                  </span>{' '}

                  <span className="text-neutral-400">
                    —{' '}
                    {log.createdAt
                      ? formatDate(log.createdAt)
                      : 'date inconnue'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-800">
            Accès rapide
          </h2>

          <div className="space-y-2">
            {can('users:read') && (
              <Link
                to="/admin/utilisateurs"
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <Users className="h-4 w-4" />
                Gérer les utilisateurs
              </Link>
            )}

            {can('feeds:read') && (
              <Link
                to="/admin/flux"
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <Rss className="h-4 w-4" />
                Gérer les flux
              </Link>
            )}

            {can('podcasts:read') && (
              <Link
                to="/admin/podcasts"
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <Podcast className="h-4 w-4" />
                Gérer les podcasts
              </Link>
            )}

            {can('settings:read') && (
              <Link
                to="/admin/parametres"
                className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                <TrendingUp className="h-4 w-4" />
                Paramètres
              </Link>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-neutral-400">
        Les contenus sont enregistrés sur le serveur et partagés avec les visiteurs du site.
      </p>
    </div>
  )
}