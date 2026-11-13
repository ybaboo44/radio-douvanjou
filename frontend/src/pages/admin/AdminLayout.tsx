import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Newspaper, Clapperboard, Podcast, Mic2,
  CalendarDays, Users, Settings, Rss, LogOut, ChevronRight, Menu,
} from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useData } from '@/store/useData'

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

function NavigationLinks({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="space-y-0.5 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = locationMatchesPath(pathname, to)
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              'flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold transition',
              active
                ? 'bg-[#D21034]/10 text-[#D21034]'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
            {active && <ChevronRight className="ml-auto h-3 w-3" />}
          </Link>
        )
      })}
    </nav>
  )
}

function locationMatchesPath(pathname: string, to: string) {
  return pathname === to || (to !== '/admin' && pathname.startsWith(`${to}/`))
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { persistenceError } = useData()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-200 bg-white lg:flex">
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-neutral-100 px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D21034] text-white">
            <Podcast className="h-4 w-4" />
          </span>
          <span className="font-editorial text-sm font-black text-neutral-950">RTD Admin</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavigationLinks pathname={pathname} />
        </div>

        <div className="shrink-0 border-t border-neutral-100 p-3">
          <div className="mb-2 min-w-0 px-3">
            <p className="truncate text-xs font-bold text-neutral-900">{user?.name || 'Invité'}</p>
            <p className="truncate text-[10px] text-neutral-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D21034] text-white">
            <Podcast className="h-4 w-4" />
          </span>
          <span className="truncate font-editorial text-sm font-black text-neutral-950">RTD Admin</span>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Ouvrir le menu d’administration"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,calc(100vw-1rem))] overflow-hidden p-0">
            <div className="flex h-full flex-col">
              <div className="border-b border-neutral-100 px-5 py-5">
                <p className="font-editorial text-base font-black text-neutral-950">Administration</p>
                <p className="mt-1 truncate text-xs text-neutral-500">{user?.email}</p>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">
                <NavigationLinks pathname={pathname} onNavigate={() => setMobileMenuOpen(false)} />
              </div>
              <div className="border-t border-neutral-100 p-3">
                <button
                  onClick={handleLogout}
                  className="flex min-h-10 w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:ml-64">
        {persistenceError && (
          <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Erreur de sauvegarde : {persistenceError}
          </div>
        )}
        <Outlet />
      </main>
    </div>
  )
}
