import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  articles as seedArticles,
  categories as seedCategories,
  authors as seedAuthors,
  shows as seedShows,
  videos as seedVideos,
  podcasts as seedPodcasts,
  events as seedEvents,
  type Article,
  type Category,
  type Author,
  type Show,
  type Video,
  type Podcast,
  type EventItem,
} from '@/data'

// Étape 1 (MVP) : les contenus vivent dans le navigateur (localStorage).
// À l'Étape 2, cette couche sera remplacée par l'API + PostgreSQL.

const LS_KEY = 'rdm-content-v1'

interface StoreShape {
  articles: Article[]
  categories: Category[]
  authors: Author[]
  shows: Show[]
  videos: Video[]
  podcasts: Podcast[]
  events: EventItem[]
}

interface DataContextValue extends StoreShape {
  publishedArticles: Article[]
  saveArticle: (article: Article) => void
  deleteArticle: (id: string) => void
  toggleArticleStatus: (id: string) => void
  saveItem: <K extends keyof StoreShape>(key: K, item: StoreShape[K][number] & { id: string }) => void
  deleteItem: (key: keyof StoreShape, id: string) => void
  resetDemo: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

function loadInitial(): StoreShape {
  const seed: StoreShape = {
    articles: seedArticles,
    categories: seedCategories,
    authors: seedAuthors,
    shows: seedShows,
    videos: seedVideos,
    podcasts: seedPodcasts,
    events: seedEvents,
  }
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreShape>
      return { ...seed, ...parsed }
    }
  } catch {
    // données corrompues -> on repart des données de démo
  }
  return seed
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreShape>(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(store))
    } catch {
      // quota dépassé : on ignore silencieusement
    }
  }, [store])

  const value = useMemo<DataContextValue>(() => {
    const publishedArticles = store.articles
      .filter((a) => a.status === 'publie')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return {
      ...store,
      publishedArticles,
      saveArticle: (article) =>
        setStore((s) => {
          const exists = s.articles.some((a) => a.id === article.id)
          return {
            ...s,
            articles: exists
              ? s.articles.map((a) => (a.id === article.id ? article : a))
              : [article, ...s.articles],
          }
        }),
      deleteArticle: (id) =>
        setStore((s) => ({ ...s, articles: s.articles.filter((a) => a.id !== id) })),
      toggleArticleStatus: (id) =>
        setStore((s) => ({
          ...s,
          articles: s.articles.map((a) =>
            a.id === id ? { ...a, status: a.status === 'publie' ? 'brouillon' : 'publie' } : a,
          ),
        })),
      saveItem: (key, item) =>
        setStore((s) => {
          const list = s[key] as { id: string }[]
          const exists = list.some((x) => x.id === item.id)
          return {
            ...s,
            [key]: exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list],
          }
        }),
      deleteItem: (key, id) =>
        setStore((s) => ({
          ...s,
          [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id),
        })),
      resetDemo: () => {
        localStorage.removeItem(LS_KEY)
        setStore(loadInitial())
      },
    }
  }, [store])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans un DataProvider')
  return ctx
}
