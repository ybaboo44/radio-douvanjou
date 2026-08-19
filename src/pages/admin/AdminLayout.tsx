import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Newspaper, Clapperboard, Podcast, Mic2,
  CalendarDays, Users, Settings, Rss, LogOut, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/videos', label: 'Vidéos', icon: Clapperboard },
  { to: '/admin/podcasts', label: 'Podcasts', icon: Podcast },
  { to: '/admin/emissions', label: 'Émissions', icon: Mic2 },
  { to: '/admin/evenements', label: 'Événements', icon: CalendarDays },
  { to: '/admin/flux', label: 'Flux RSS', icon: Rss },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-100 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D21034] text-white">
            <Podcast className="h-4 w-4" />
          </span>
          <span className="font-editorial text-sm font-black text-neutral-950">RDM Admin</span>
        </div>

        <nav className="space-y-0.5 p-3">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || location.pathname.startsWith(`${to}/`)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold transition',
                  active
                    ? 'bg-[#D21034]/10 text-[#D21034]'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-neutral-100 p-3">
          <div className="mb-2 px-3">
            <p className="text-xs font-bold text-neutral-900">{user?.name || 'Invité'}</p>
            <p className="text-[10px] text-neutral-500">{user?.email}</p>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}