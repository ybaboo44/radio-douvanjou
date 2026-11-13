import { Link, useParams } from 'react-router'
import { ArrowLeft, Clock, Eye, Facebook, Link2, Twitter } from 'lucide-react'
import { useState } from 'react'
import { useData } from '@/store/useData'
import { formatDate, formatViews, getAuthor, getCategory } from '@/data'
import { ArticleCard, CategoryBadge } from '@/components/shared'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { publishedArticles } = useData()
  const [copied, setCopied] = useState(false)

  const article = publishedArticles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-editorial text-3xl font-black">Article introuvable</h1>
        <p className="mt-3 text-neutral-600">Cet article n'existe pas ou n'est pas encore publié.</p>
        <Link to="/actualites" className="mt-6 inline-block rounded-full bg-[#D21034] px-6 py-3 text-sm font-bold text-white">
          Retour aux actualités
        </Link>
      </div>
    )
  }

  const author = getAuthor(article.authorId)
  const category = getCategory(article.categoryId)
  const similar = publishedArticles
    .filter((a) => a.id !== article.id && a.categoryId === article.categoryId)
    .slice(0, 3)
  const shareUrl = window.location.href

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard indisponible
    }
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-[#D21034]">
        <ArrowLeft className="h-4 w-4" /> Toutes les actualités
      </Link>

      <div className="mt-6">
        <CategoryBadge categoryId={article.categoryId} />
        <h1 className="font-editorial mt-4 text-3xl font-black leading-tight tracking-tight text-neutral-950 md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">{article.excerpt}</p>
      </div>

      {/* Méta + auteur */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-neutral-200 py-4">
        <div className="flex items-center gap-3">
          {author && (
            <>
              <img src={author.avatar} alt={author.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <div className="text-sm font-bold text-neutral-950">{author.name}</div>
                <div className="text-xs text-neutral-500">{author.role}</div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5" /> {formatViews(article.views)} vues
          </span>
        </div>
      </div>

      {/* Image */}
      <figure className="mt-8 overflow-hidden rounded-xl">
        <img src={article.image} alt={article.title} className="aspect-[16/9] w-full object-cover" />
        <figcaption className="mt-2 text-xs text-neutral-500">
          Illustration : {category?.name} — Radio Télévision Douvanjou
        </figcaption>
      </figure>

      {/* Contenu */}
      <div className="mt-8 space-y-6">
        {article.content.map((p, i) => (
          <p key={i} className="text-[17px] leading-8 text-neutral-800 first:text-lg first:font-medium first:text-neutral-900">
            {p}
          </p>
        ))}
      </div>

      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {article.tags.map((t) => (
          <Link
            key={t}
            to={`/actualites?q=${encodeURIComponent(t)}`}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-200"
          >
            #{t}
          </Link>
        ))}
      </div>

      {/* Partage */}
      <div className="mt-8 flex items-center gap-3 rounded-xl bg-neutral-50 p-4">
        <span className="text-sm font-bold text-neutral-800">Partager :</span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition hover:opacity-85"
          aria-label="Partager sur Facebook"
        >
          <Facebook className="h-4 w-4" />
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`}
          target="_blank"
          rel="noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white transition hover:opacity-85"
          aria-label="Partager sur X"
        >
          <Twitter className="h-4 w-4" />
        </a>
        <button
          onClick={copyLink}
          className="flex h-9 items-center gap-2 rounded-full bg-neutral-200 px-4 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-300"
        >
          <Link2 className="h-4 w-4" />
          {copied ? 'Lien copié !' : 'Copier le lien'}
        </button>
      </div>

      {/* Articles similaires */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-editorial border-b-2 border-[#D21034] pb-3 text-2xl font-black text-neutral-950">
            Articles similaires
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
