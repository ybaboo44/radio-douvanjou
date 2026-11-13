import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useData } from '@/store/useData'
import { ArticleCard } from '@/components/shared'
import { cn } from '@/lib/utils'

const PER_PAGE = 9

export default function Actualites() {
  const { publishedArticles, categories } = useData()
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get('q') ?? '')
  const activeCat = params.get('cat') ?? 'tous'
  const query = params.get('q') ?? ''
  const filterKey = `${activeCat}\0${query}`
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1
  const setPage = (nextPage: number | ((page: number) => number)) => {
    setPageState({
      filterKey,
      page: typeof nextPage === 'function' ? nextPage(page) : nextPage,
    })
  }

  const filtered = useMemo(() => {
    let list = publishedArticles
    if (activeCat !== 'tous') {
      const cat = categories.find((c) => c.slug === activeCat)
      if (cat) list = list.filter((a) => a.categoryId === cat.id)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)),
      )
    }
    return list
  }, [publishedArticles, categories, activeCat, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, totalPages)
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const setCat = (slug: string) => {
    const next = new URLSearchParams(params)
    if (slug === 'tous') next.delete('cat')
    else next.set('cat', slug)
    setParams(next)
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (search.trim()) next.set('q', search.trim())
    else next.delete('q')
    setParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 border-[#D21034] pb-4">
        <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">Actualités</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Toute l'information d'Haïti et de la diaspora, par la rédaction de Radio Télévision Douvanjou.
        </p>
      </div>

      {/* Recherche */}
      <form onSubmit={submitSearch} className="mt-6 flex max-w-xl items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-neutral-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un article, un sujet, un tag…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
        />
        <button type="submit" className="shrink-0 rounded-full bg-neutral-950 px-4 py-1.5 text-xs font-semibold text-white">
          Rechercher
        </button>
      </form>

      {/* Filtres catégories */}
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <FilterPill label="Tous" active={activeCat === 'tous'} onClick={() => setCat('tous')} />
        {categories.map((c) => (
          <FilterPill
            key={c.id}
            label={c.name}
            active={activeCat === c.slug}
            color={c.color}
            onClick={() => setCat(c.slug)}
          />
        ))}
      </div>

      {/* Résultats */}
      <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
        <span>
          {filtered.length} article{filtered.length > 1 ? 's' : ''}
          {query && (
            <>
              {' '}
              pour « <strong className="text-neutral-800">{query}</strong> »
            </>
          )}
        </span>
        {totalPages > 1 && (
          <span>
            Page {current} / {totalPages}
          </span>
        )}
      </div>

      {pageItems.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
          Aucun article ne correspond à votre recherche.
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 disabled:opacity-40"
            aria-label="Page précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                'h-9 w-9 rounded-full text-sm font-semibold transition',
                p === current ? 'bg-[#D21034] text-white' : 'border border-neutral-300 hover:bg-neutral-100',
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 disabled:opacity-40"
            aria-label="Page suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function FilterPill({
  label,
  active,
  onClick,
  color,
}: {
  label: string
  active: boolean
  onClick: () => void
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition',
        active
          ? 'border-transparent text-white'
          : 'border-neutral-300 text-neutral-700 hover:border-neutral-500',
      )}
      style={active ? { backgroundColor: color ?? '#0a0a0a' } : undefined}
    >
      {label}
    </button>
  )
}
