import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'
import { useData } from '@/store/useData'
import { slugify, type Article } from '@/data'

export default function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { articles, categories, authors, saveArticle } = useData()

  const existing = id ? articles.find((a) => a.id === id) : undefined
  const isNew = !id

  const [form, setForm] = useState<Article>(() =>
    existing ?? {
      id: `a-${Date.now()}`,
      slug: '',
      title: '',
      excerpt: '',
      content: [''],
      image: `https://picsum.photos/seed/rdm-${Date.now()}/1200/800`,
      categoryId: categories[0]?.id ?? 'haiti',
      authorId: authors[0]?.id ?? 'jpb',
      tags: [],
      status: 'brouillon',
      publishedAt: new Date().toISOString(),
      views: 0,
    },
  )
  const [tagsInput, setTagsInput] = useState(form.tags.join(', '))
  const [contentInput, setContentInput] = useState(form.content.join('\n\n'))
  const [slugTouched, setSlugTouched] = useState(!isNew)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof Article>(key: K, value: Article[K]) => setForm((f) => ({ ...f, [key]: value }))

  const submit = (publish?: boolean) => {
    const article: Article = {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      content: contentInput
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      status: publish ? 'publie' : form.status,
    }
    saveArticle(article)
    setSaved(true)
    setTimeout(() => navigate('/admin/articles'), 600)
  }

  const inputCls =
    'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#D21034] focus:ring-2 focus:ring-[#D21034]/20'

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link to="/admin/articles" className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#D21034]">
            <ArrowLeft className="h-4 w-4" /> Articles
          </Link>
          <h1 className="font-editorial mt-2 text-2xl font-black text-neutral-950 md:text-3xl">
            {isNew ? 'Nouvel article' : 'Modifier l’article'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => submit(false)}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50"
          >
            <Save className="h-4 w-4" /> {saved ? 'Enregistré !' : 'Enregistrer'}
          </button>
          <button
            onClick={() => submit(true)}
            className="rounded-lg bg-[#D21034] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b00d2b]"
          >
            Publier
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5 rounded-xl border border-neutral-200 bg-white p-6">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Titre</label>
          <input
            className={inputCls}
            value={form.title}
            onChange={(e) => {
              const title = e.target.value
              setForm((currentForm) => ({
                ...currentForm,
                title,
                ...(!slugTouched ? { slug: slugify(title) } : {}),
              }))
            }}
            placeholder="Titre de l'article"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Slug (URL)</label>
            <input
              className={inputCls}
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', slugify(e.target.value))
              }}
              placeholder="slug-de-l-article"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Image (URL)</label>
            <input className={inputCls} value={form.image} onChange={(e) => set('image', e.target.value)} />
          </div>
        </div>

        {form.image && (
          <img src={form.image} alt="Aperçu" className="aspect-[16/6] w-full rounded-lg object-cover" />
        )}

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Résumé</label>
          <textarea className={inputCls} rows={2} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Chapeau de l'article…" />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
            Contenu <span className="font-normal normal-case text-neutral-400">(un paragraphe par bloc, séparés par une ligne vide)</span>
          </label>
          <textarea className={inputCls} rows={12} value={contentInput} onChange={(e) => setContentInput(e.target.value)} />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Catégorie</label>
            <select className={inputCls} value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Auteur</label>
            <select className={inputCls} value={form.authorId} onChange={(e) => set('authorId', e.target.value)}>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Statut</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => set('status', e.target.value as Article['status'])}
            >
              <option value="brouillon">Brouillon</option>
              <option value="publie">Publié</option>
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">
              Tags <span className="font-normal normal-case text-neutral-400">(séparés par des virgules)</span>
            </label>
            <input className={inputCls} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="politique, élections" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Date de publication</label>
            <input
              type="datetime-local"
              className={inputCls}
              value={form.publishedAt.slice(0, 16)}
              onChange={(e) => set('publishedAt', new Date(e.target.value).toISOString())}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={!!form.featured}
            onChange={(e) => set('featured', e.target.checked)}
            className="h-4 w-4 accent-[#D21034]"
          />
          Mettre à la une (homepage)
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={!!form.breaking}
            onChange={(e) => set('breaking', e.target.checked)}
            className="h-4 w-4 accent-[#D21034]"
          />
          Dernière nouvelle (bandeau rouge)
        </label>
      </div>
    </div>
  )
}
