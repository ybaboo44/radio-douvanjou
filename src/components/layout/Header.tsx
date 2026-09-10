import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import {
  Menu,
  Search,
  Radio,
  X,
} from 'lucide-react'

import { SITE } from '@/config'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

/* ============================================================
   NAVIGATION
   ============================================================ */

const NAV_GROUPS = [
  {
    label: 'Actualités',
    links: [
      {
        label: 'Accueil',
        path: '/',
      },
      {
        label: 'Actualités',
        path: '/actualites',
      },
    ],
  },

  {
    label: 'Média',
    links: [
      {
        label: 'Radio',
        path: '/radio',
      },
      {
        label: 'TV',
        path: '/tv',
      },
      {
        label: 'Vidéos',
        path: '/videos',
      },
      {
        label: 'Podcasts',
        path: '/podcasts',
      },
      {
        label: 'Émissions',
        path: '/emissions',
      },
    ],
  },

  {
    label: 'Thématiques',
    links: [
      {
        label: 'Culture',
        path: '/culture',
      },
      {
        label: 'Sport',
        path: '/sport',
      },
      {
        label: 'Événements',
        path: '/evenements',
      },
    ],
  },
]

/* ============================================================
   BOUTON EN DIRECT
   ============================================================ */

function LiveButton() {
  return (
    <Link
      to="/radio"
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#D21034] px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white transition hover:bg-[#b00d2b]"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>

      En direct
    </Link>
  )
}

/* ============================================================
   DATE + HEURE
   ============================================================ */

function DateTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  return (
    <div className="flex items-center gap-3 text-[11px] font-medium tracking-wide text-neutral-400">
      <span className="capitalize">
        {date}
      </span>

      <span className="h-3 w-px bg-neutral-700" />

      <span className="font-mono tabular-nums text-neutral-300">
        {time}
      </span>
    </div>
  )
}

/* ============================================================
   HEADER
   ============================================================ */

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const navigate = useNavigate()

  /* ==========================================================
     RECHERCHE
     ========================================================== */

  const submitSearch = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const value = query.trim()

    if (!value) {
      return
    }

    navigate(
      `/actualites?q=${encodeURIComponent(value)}`,
    )

    setQuery('')
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* ======================================================
          BARRE DATE + HEURE
          ====================================================== */}

      <div className="bg-neutral-950 text-white">

        <div className="mx-auto flex h-9 max-w-7xl items-center px-4">

          <DateTime />

        </div>

      </div>

      {/* ======================================================
          NAVIGATION PRINCIPALE
          LOGO + NAVIGATION + RECHERCHE + DIRECT
          ====================================================== */}

      <div className="border-b border-neutral-200 bg-white">

        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center gap-6 px-4">

          {/* ==================================================
              LOGO
              ================================================== */}

          <Link
            to="/"
            aria-label="Radio Douvanjou"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo.png"
              alt="Radio Douvanjou"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* ==================================================
              NAVIGATION DESKTOP
              ================================================== */}

          <nav className="hidden min-w-0 flex-1 items-center lg:flex">

            {NAV_GROUPS.map((group, groupIndex) => (
              <div
                key={group.label}
                className={cn(
                  'flex items-center',
                  groupIndex > 0 &&
                    'ml-3 border-l border-neutral-200 pl-3',
                )}
              >

                {group.links.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      cn(
                        'relative flex h-[72px] items-center whitespace-nowrap px-2.5 text-[11px] font-bold uppercase tracking-wide transition xl:px-3',
                        isActive
                          ? 'text-[#D21034]'
                          : 'text-neutral-600 hover:text-neutral-950',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}

                        {isActive && (
                          <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#D21034]" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}

              </div>
            ))}

          </nav>

          {/* ==================================================
              ACTIONS DESKTOP
              ================================================== */}

          <div className="hidden shrink-0 items-center gap-2 lg:flex">

            {/* Recherche */}

            <button
              type="button"
              onClick={() =>
                setSearchOpen((value) => !value)
              }
              aria-label={
                searchOpen
                  ? 'Fermer la recherche'
                  : 'Ouvrir la recherche'
              }
              className="rounded-full p-2.5 transition hover:bg-neutral-100"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {/* Direct */}

            <LiveButton />

          </div>

          {/* ==================================================
              MOBILE
              ================================================== */}

          <div className="ml-auto flex items-center gap-1 lg:hidden">

            {/* Recherche mobile */}

            <button
              type="button"
              onClick={() =>
                setSearchOpen((value) => !value)
              }
              aria-label={
                searchOpen
                  ? 'Fermer la recherche'
                  : 'Rechercher'
              }
              className="rounded-full p-2.5 transition hover:bg-neutral-100"
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {/* Menu mobile */}

            <Sheet>

              <SheetTrigger asChild>

                <button
                  type="button"
                  aria-label="Ouvrir le menu"
                  className="rounded-md p-2.5 transition hover:bg-neutral-100"
                >
                  <Menu className="h-6 w-6" />
                </button>

              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[320px] overflow-y-auto p-0"
              >

                {/* Logo mobile */}

                <div className="border-b border-neutral-200 px-5 py-6">

                  <Link to="/">
                    <img
                      src="/logo.png"
                      alt="Radio Douvanjou"
                      className="h-12 w-auto object-contain"
                    />
                  </Link>

                </div>

                {/* Menu */}

                <nav className="px-4 py-5">

                  {NAV_GROUPS.map((group) => (
                    <div
                      key={group.label}
                      className="mb-6"
                    >

                      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                        {group.label}
                      </div>

                      <div className="space-y-1">

                        {group.links.map((item) => (
                          <SheetClose
                            asChild
                            key={item.path}
                          >
                            <NavLink
                              to={item.path}
                              end={item.path === '/'}
                              className={({ isActive }) =>
                                cn(
                                  'flex items-center rounded-md px-3 py-3 text-sm font-semibold transition',
                                  isActive
                                    ? 'bg-red-50 text-[#D21034]'
                                    : 'text-neutral-700 hover:bg-neutral-100',
                                )
                              }
                            >
                              {item.label}
                            </NavLink>
                          </SheetClose>
                        ))}

                      </div>

                    </div>
                  ))}

                  {/* Direct mobile */}

                  <div className="border-t border-neutral-200 pt-5">

                    <SheetClose asChild>

                      <Link
                        to="/radio"
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-[#D21034] px-4 py-3 text-xs font-bold uppercase text-white transition hover:bg-[#b00d2b]"
                      >
                        <Radio className="h-4 w-4" />
                        En direct
                      </Link>

                    </SheetClose>

                  </div>

                </nav>

              </SheetContent>

            </Sheet>

          </div>

        </div>

        {/* ====================================================
            RECHERCHE
            ==================================================== */}

        {searchOpen && (
          <div className="border-t border-neutral-200 bg-neutral-50">

            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3"
            >

              <Search className="h-5 w-5 shrink-0 text-neutral-400" />

              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Rechercher dans Radio Douvanjou..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />

              <button
                type="submit"
                className="rounded-md bg-neutral-950 px-5 py-2 text-xs font-bold text-white transition hover:bg-neutral-800"
              >
                Rechercher
              </button>

            </form>

          </div>
        )}

      </div>

    </header>
  )
}
