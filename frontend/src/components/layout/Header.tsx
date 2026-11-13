import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Menu, Search, X } from 'lucide-react'
import { SITE } from '@/config'
import { useSiteSettings } from '@/store/useSiteSettings'
import { getSettingValue } from '@/store/site-settings-utils'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Accueil', path: '/' },
  { label: 'Actualités', path: '/actualites' },
  { label: 'Radio', path: '/radio' },
  { label: 'Télévision', path: '/tv' },
  { label: 'Vidéos', path: '/videos' },
  { label: 'Podcasts', path: '/podcasts' },
  { label: 'Émissions', path: '/emissions' },
  { label: 'Culture', path: '/culture' },
  { label: 'Sport', path: '/sport' },
  { label: 'Événements', path: '/evenements' },
]

function DateTime() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <time
      dateTime={now.toISOString()}
      className="text-[11px] font-medium capitalize tracking-wide text-white/75"
    >
      {now.toLocaleDateString('fr-HT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </time>
  )
}

function LiveLink({ mobile = false }: { mobile?: boolean }) {
  return (
    <Link
      to="/radio"
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#D21034] font-bold text-white transition hover:bg-[#b00d2b]',
        mobile ? 'w-full px-4 py-3 text-xs uppercase tracking-wider' : 'px-4 py-2 text-[11px] uppercase tracking-wide',
      )}
    >
      <span className="rdm-live-dot h-2 w-2 rounded-full bg-white" />
      Écouter en direct
    </Link>
  )
}

export default function Header() {
  const { settings } = useSiteSettings()
  const siteName = getSettingValue(settings, 'site.name') || SITE.name
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = query.trim()
    if (!value) return
    navigate(`/actualites?q=${encodeURIComponent(value)}`)
    setQuery('')
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="bg-[#111827]">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4">
          <DateTime />
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:block">
            Haïti · Caraïbes · Diaspora
          </span>
        </div>
      </div>

      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center gap-5 px-4">
        <Link to="/" aria-label={`${siteName} — Accueil`} className="flex shrink-0 items-center">
          <img
            src="/image/images.png"
            alt="Radio Télévision Douvanjou"
            className="h-[68px] w-[132px] object-cover object-center"
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
          {links.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex h-[76px] items-center whitespace-nowrap px-2 text-[10px] font-bold uppercase tracking-wide transition 2xl:px-2.5 2xl:text-[11px]',
                  isActive ? 'text-[#D21034]' : 'text-neutral-600 hover:text-neutral-950',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <span className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-[#D21034]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-3 xl:flex">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? 'Fermer la recherche' : 'Ouvrir la recherche'}
            className="rounded-full p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <LiveLink />
        </div>

        <div className="ml-auto flex items-center gap-1 xl:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? 'Fermer la recherche' : 'Rechercher'}
            className="rounded-full p-2.5 text-neutral-700 transition hover:bg-neutral-100"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Ouvrir le menu"
                className="rounded-full p-2.5 text-neutral-700 transition hover:bg-neutral-100"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(20rem,calc(100vw-1rem))] overflow-y-auto p-0">
              <div className="border-b border-neutral-200 px-5 py-5">
                <Link to="/" aria-label={`${siteName} — Accueil`}>
                  <img
                    src="/image/images.png"
                    alt="Radio Télévision Douvanjou"
                    className="h-[62px] w-[120px] object-cover object-center"
                  />
                </Link>
              </div>
              <nav aria-label="Navigation mobile" className="space-y-1 px-4 py-5">
                {links.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex w-full items-center rounded-lg px-3 py-3 text-sm font-semibold transition',
                        isActive ? 'bg-red-50 text-[#D21034]' : 'text-neutral-700 hover:bg-neutral-100',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-4">
                  <SheetClose asChild>
                    <LiveLink mobile />
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50">
          <form onSubmit={submitSearch} className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-neutral-400" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher dans l'actualité..."
              aria-label="Rechercher dans l'actualité"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800"
            >
              Rechercher
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
