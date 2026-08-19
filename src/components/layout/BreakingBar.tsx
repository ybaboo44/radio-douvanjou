import { Link } from 'react-router'
import { useData } from '@/store/DataContext'

export default function BreakingBar() {
  const { publishedArticles } = useData()
  const breaking = publishedArticles.filter((a) => a.breaking)
  const items = (breaking.length > 0 ? breaking : publishedArticles.slice(0, 4)).map((a) => a.title)
  if (items.length === 0) return null
  const doubled = [...items, ...items]

  return (
    <div className="flex items-stretch border-b border-neutral-200 bg-[#D21034] text-white">
      <div className="flex shrink-0 items-center gap-2 bg-neutral-950 px-3 py-2 text-[11px] font-black uppercase tracking-wider md:px-5">
        <span className="rdm-live-dot inline-block h-2 w-2 rounded-full bg-[#D21034]" />
        <span className="hidden sm:inline">Dernières nouvelles</span>
        <span className="sm:hidden">Flash</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="rdm-marquee flex h-full w-max items-center">
          {doubled.map((t, i) => (
            <span key={i} className="flex items-center whitespace-nowrap px-6 text-sm font-medium">
              <span className="mr-6 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <Link
        to="/actualites"
        className="hidden shrink-0 items-center bg-white/10 px-4 text-xs font-semibold uppercase tracking-wide transition hover:bg-white/20 md:flex"
      >
        Toutes les actualités
      </Link>
    </div>
  )
}
