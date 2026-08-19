import { NavLink, Outlet, Link } from 'react-router'
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Users,
  Mic2,
  Radio,
  Tv,
  Clapperboard,
  Podcast,
  CalendarDays,
  Image,
  UserCog,
  Settings,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MENU = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Articles', path: '/admin/articles', icon: Newspaper },
  { label: 'Catégories', path: '/admin/categories', icon: Tags },
  { label: 'Auteurs', path: '/admin/auteurs', icon: Users },
  { label: 'Émissions', path: '/admin/emissions', icon: Mic2 },
  { label: 'Radio', path: '/admin/radio', icon: Radio },
  { label: 'TV', path: '/admin/tv', icon: Tv },
  { label: 'Vidéos', path: '/admin/videos', icon: Clapperboard },
  { label: 'Podcasts', path: '/admin/podcasts', icon: Podcast },
  { label: 'Événements', path: '/admin/evenements', icon: CalendarDays },
  { label: 'Médias', path: '/admin/medias', icon: Image },
  { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: UserCog },
  { label: 'Paramètres', path: '/admin/parametres', icon: Settings },
]

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col bg-neutral-950 text-neutral-300 lg:flex">
        <div className="border-b border-neutral-800 p-5">
          <div className="font-editorial text-lg font-black text-white">RDM Admin</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5B7FE8]">Radio Douvanjou Media</div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          {MENU.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              end={m.end}
              className={({ isActive }) =>
                cn(
                  'mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  isActive ? 'bg-[#D21034] text-white' : 'hover:bg-neutral-800 hover:text-white',
                )
              }
            >
              <m.icon className="h-4 w-4 shrink-0" />
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-800 p-4">
          <Link to="/" className="flex items-center gap-2 text-xs text-neutral-400 transition hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
          </Link>
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex-1 lg:ml-60">
        {/* Barre mobile */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <span className="font-editorial text-lg font-black">RDM Admin</span>
          <Link to="/" className="text-xs font-semibold text-neutral-500">
            ← Site
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2 no-scrollbar lg:hidden">
          {MENU.map((m) => (
            <NavLink
              key={m.path}
              to={m.path}
              end={m.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold',
                  isActive ? 'bg-[#D21034] text-white' : 'bg-neutral-100 text-neutral-700',
                )
              }
            >
              <m.icon className="h-3.5 w-3.5" />
              {m.label}
            </NavLink>
          ))}
        </nav>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
