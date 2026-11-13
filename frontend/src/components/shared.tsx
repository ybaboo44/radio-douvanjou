import { Link } from 'react-router'
import { ArrowRight, Clock, Eye, Send } from 'lucide-react'
import { useState } from 'react'
import { formatDate, formatViews, getAuthor, getCategory, type Article } from '@/data'
import { cn } from '@/lib/utils'

// ------------------------------------------------------------
// Badge de catégorie
// ------------------------------------------------------------
export function CategoryBadge({ categoryId, className }: { categoryId: string; className?: string }) {
  const cat = getCategory(categoryId)
  if (!cat) return null
  return (
    <span
      className={cn(
        'inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white',
        className,
      )}
      style={{ backgroundColor: cat.color }}
    >
      {cat.name}
    </span>
  )
}

// ------------------------------------------------------------
// Titre de section éditorial
// ------------------------------------------------------------
export function SectionHeader({
  title,
  linkTo,
  linkLabel = 'Tout voir',
  accent = '#D21034',
}: {
  title: string
  linkTo?: string
  linkLabel?: string
  accent?: string
}) {
  return (
    <div className="mb-6 flex items-end justify-between border-b-2 pb-3" style={{ borderColor: accent }}>
      <h2 className="font-editorial text-2xl font-black tracking-tight text-neutral-950 md:text-3xl">{title}</h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 transition hover:text-[#D21034]"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// Carte d'article
// ------------------------------------------------------------
export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  const author = getAuthor(article.authorId)
  return (
    <Link
      to={`/actualites/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-lg"
    >
      <div className={cn('relative overflow-hidden', large ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <CategoryBadge categoryId={article.categoryId} className="absolute left-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3
          className={cn(
            'font-editorial font-bold leading-snug text-neutral-950 transition group-hover:text-[#D21034]',
            large ? 'text-xl md:text-2xl' : 'text-base line-clamp-2',
          )}
        >
          {article.title}
        </h3>
        {large && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{article.excerpt}</p>}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">{author?.name}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatViews(article.views)}
          </span>
        </div>
      </div>
    </Link>
  )
}

// ------------------------------------------------------------
// Ligne d'article compacte (listes)
// ------------------------------------------------------------
export function ArticleRow({ article, index }: { article: Article; index?: number }) {
  return (
    <Link to={`/actualites/${article.slug}`} className="group flex gap-4 border-b border-neutral-100 py-4 last:border-0">
      {typeof index === 'number' && (
        <span className="font-editorial text-3xl font-black text-neutral-200 transition group-hover:text-[#D21034]">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <CategoryBadge categoryId={article.categoryId} />
        <h4 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-neutral-900 transition group-hover:text-[#D21034]">
          {article.title}
        </h4>
        <span className="mt-1 block text-xs text-neutral-500">{formatDate(article.publishedAt)}</span>
      </div>
      <img
        src={article.image}
        alt=""
        loading="lazy"
        className="h-16 w-24 shrink-0 rounded object-cover sm:h-20 sm:w-32"
      />
    </Link>
  )
}

// ------------------------------------------------------------
// Bloc newsletter
// ------------------------------------------------------------
export function Newsletter() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="bg-neutral-950 py-14 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#5B7FE8]">Newsletter</span>
        <h2 className="font-editorial mt-3 text-3xl font-black md:text-4xl">
          L'essentiel de l'actualité haïtienne, chaque matin
        </h2>
        <p className="mt-3 text-neutral-400">
          Recevez le résumé de la rédaction, la programmation du jour et les grands entretiens directement dans votre
          boîte mail.
        </p>
        {done ? (
          <p className="mx-auto mt-6 max-w-md rounded-lg bg-green-900/40 px-4 py-3 text-sm text-green-300">
            Merci ! Votre inscription à la newsletter de Radio Douvanjou Media est confirmée.
          </p>
        ) : (
          <form
            className="mx-auto mt-6 flex max-w-md overflow-hidden rounded-full bg-white p-1.5"
            onSubmit={(e) => {
              e.preventDefault()
              if (email.includes('@')) setDone(true)
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail"
              className="w-full bg-transparent px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-2 rounded-full bg-[#D21034] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#b00d2b]"
            >
              <Send className="h-3.5 w-3.5" />
              S'inscrire
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
