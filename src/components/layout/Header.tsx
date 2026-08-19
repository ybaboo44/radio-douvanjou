import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Menu, Search, Radio, X, Globe } from 'lucide-react'
import { NAV_LINKS, SITE } from '@/config'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

function LiveBadge({ className }: { className?: string }) {
  return (
    <Link
      to="/radio"
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-[#D21034] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#b00d2b]',
        className,
      )}
    >
      <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-white" />
      En direct
    </Link>
  )
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/actualites?q=${encodeURIComponent(query.trim())}`)
      setSearchOpen(false)
      setQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Barre supérieure */}
      <div className="border-b border-neutral-200 bg-neutral-950 text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs">
          <span className="hidden capitalize text-neutral-300 sm:block">{today}</span>
          <span className="text-neutral-300 sm:hidden">{SITE.shortName}</span>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1.5 text-neutral-300 transition hover:text-white"
              title="Changer de langue (bientôt disponible)"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>FR</span>
            </button>
            <Link to="/admin" className="text-neutral-400 transition hover:text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Logo + actions */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20">
          <Sheet>
            <SheetTrigger asChild>
              <button className="rounded-md p-2 hover:bg-neutral-100 lg:hidden" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto p-0">
              <div className="border-b p-5">
                <Logo />
              </div>
              <nav className="flex flex-col p-3">
                {NAV_LINKS.map((l) => (
                  <SheetClose asChild key={l.path}>
                    <NavLink
                      to={l.path}
                      end={l.path === '/'}
                      className={({ isActive }) =>
                        cn(
                          'rounded-md px-4 py-3 text-sm font-semibold transition',
                          isActive ? 'bg-red-50 text-[#D21034]' : 'text-neutral-800 hover:bg-neutral-100',
                        )
                      }
                    >
                      {l.label}
                    </NavLink>
                  </SheetClose>
                ))}
                <div className="mt-3 border-t pt-3">
                  <SheetClose asChild>
                    <Link
                      to="/radio"
                      className="flex items-center gap-2 rounded-md bg-[#D21034] px-4 py-3 text-sm font-bold uppercase text-white"
                    >
                      <Radio className="h-4 w-4" /> Écouter en direct
                    </Link>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="shrink-0">
            <Logo />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2.5 hover:bg-neutral-100"
              aria-label="Rechercher"
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
            <LiveBadge className="hidden sm:inline-flex" />
          </div>
        </div>

        {/* Recherche dépliée */}
        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50">
            <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
              <Search className="h-5 w-5 text-neutral-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article, une émission, un sujet…"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
              <button type="submit" className="rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white">
                Rechercher
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation principale */}
      <nav className="hidden border-b border-neutral-200 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 no-scrollbar">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              end={l.path === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap border-b-2 px-3 py-3 text-[13px] font-semibold uppercase tracking-wide transition',
                  isActive
                    ? 'border-[#D21034] text-[#D21034]'
                    : 'border-transparent text-neutral-700 hover:border-neutral-300 hover:text-neutral-950',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#D21034] text-white">
        <Radio className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <div className="font-editorial text-lg font-black tracking-tight text-neutral-950 md:text-xl">
          RADIO DOUVANJOU
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#00209F]">Media</div>
      </div>
    </div>
  )
}
