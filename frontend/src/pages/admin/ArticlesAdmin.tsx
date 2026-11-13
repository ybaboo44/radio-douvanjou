import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Pencil, PlusCircle, Search, Trash2, Upload, Download } from 'lucide-react'
import { useData } from '@/store/useData'
import { formatDate, getAuthor, getCategory } from '@/data'
import { cn } from '@/lib/utils'

export default function ArticlesAdmin() {
  const { articles, categories, deleteArticle, toggleArticleStatus } = useData()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('tous')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'publie' | 'brouillon'>('tous')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...articles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    if (catFilter !== 'tous') list = list.filter((a) => a.categoryId === catFilter)
    if (statusFilter !== 'tous') list = list.filter((a) => a.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list
  }, [articles, catFilter, statusFilter, search])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl font-black text-neutral-950 md:text-3xl">Articles</h1>
          <p className="text-sm text-neutral-500">
            {articles.length} articles · {articles.filter((a) => a.status === 'publie').length} publiés ·{' '}
            {articles.filter((a) => a.status === 'brouillon').length} brouillons
          </p>
        </div>
        <Link
          to="/admin/articles/nouveau"
          className="flex items-center gap-2 rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b]"
        >
          <PlusCircle className="h-4 w-4" /> Nouvel article
        </Link>
      </div>

      {/* Filtres */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex min-w-52 flex-1 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un article…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          <option value="tous">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex rounded-lg border border-neutral-300 bg-white p-0.5 text-xs font-semibold">
          {(
            [
              ['tous', 'Tous'],
              ['publie', 'Publiés'],
              ['brouillon', 'Brouillons'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              onClick={() => setStatusFilter(v)}
              className={cn(
                'rounded-md px-3 py-1.5 transition',
                statusFilter === v ? 'bg-neutral-950 text-white' : 'text-neutral-600 hover:bg-neutral-100',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Article</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Auteur</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={a.image} alt="" className="h-10 w-14 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="line-clamp-1 max-w-72 font-semibold text-neutral-900">{a.title}</div>
                      <div className="text-xs text-neutral-400">/{a.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded px-2 py-0.5 text-[10px] font-bold uppercase text-white"
                    style={{ backgroundColor: getCategory(a.categoryId)?.color ?? '#666' }}
                  >
                    {getCategory(a.categoryId)?.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-600">{getAuthor(a.authorId)?.name}</td>
                <td className="px-4 py-3 text-neutral-600">{formatDate(a.publishedAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[10px] font-bold uppercase',
                      a.status === 'publie' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700',
                    )}
                  >
                    {a.status === 'publie' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => toggleArticleStatus(a.id)}
                      title={a.status === 'publie' ? 'Dépublier' : 'Publier'}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg transition',
                        a.status === 'publie'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200',
                      )}
                    >
                      {a.status === 'publie' ? <Download className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    </button>
                    <Link
                      to={`/admin/articles/${a.id}`}
                      title="Modifier"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    {confirmDelete === a.id ? (
                      <span className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteArticle(a.id)
                            setConfirmDelete(null)
                          }}
                          className="rounded-lg bg-[#D21034] px-2 py-1.5 text-[10px] font-bold text-white"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-lg bg-neutral-200 px-2 py-1.5 text-[10px] font-bold text-neutral-700"
                        >
                          Annuler
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(a.id)}
                        title="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-[#D21034] transition hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  Aucun article ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
