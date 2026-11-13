import { useData } from '@/store/useData'
import { ArticleCard, ArticleRow } from '@/components/shared'

export default function CategoryPage({
  categoryId,
  title,
  description,
  accent,
}: {
  categoryId: string
  title: string
  description: string
  accent: string
}) {
  const { publishedArticles } = useData()
  const list = publishedArticles.filter((a) => a.categoryId === categoryId)
  const hero = list[0]
  const rest = list.slice(1)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="border-b-2 pb-4" style={{ borderColor: accent }}>
        <h1 className="font-editorial text-3xl font-black tracking-tight text-neutral-950 md:text-4xl">{title}</h1>
        <p className="mt-1 text-sm text-neutral-600">{description}</p>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
          Aucun article dans cette rubrique pour le moment.
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {hero && <ArticleCard article={hero} large />}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {rest.slice(0, 4).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
          <aside className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <h3 className="font-editorial text-lg font-black text-neutral-950">Dans cette rubrique</h3>
            {rest.slice(4).length === 0 && rest.length <= 4 ? (
              <div>
                {rest.map((a) => (
                  <ArticleRow key={a.id} article={a} />
                ))}
              </div>
            ) : (
              <div>
                {rest.slice(4).map((a) => (
                  <ArticleRow key={a.id} article={a} />
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
