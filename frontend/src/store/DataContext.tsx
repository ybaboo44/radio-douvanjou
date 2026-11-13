import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { DataContext, type StoreShape, type DataContextValue } from './data-context'
import {
  articles as seedArticles,
  categories as seedCategories,
  authors as seedAuthors,
  shows as seedShows,
  videos as seedVideos,
  podcasts as seedPodcasts,
  events as seedEvents,
} from '@/data'

// Étape 1 (MVP) : les contenus vivent dans le navigateur (localStorage).
// À l'Étape 2, cette couche sera remplacée par l'API + PostgreSQL.

const LS_KEY = 'rdm-content-v1'

const STORE_KEYS: (keyof StoreShape)[] = ['articles', 'categories', 'authors', 'shows', 'videos', 'podcasts', 'events']

function isStoreShape(value: unknown): value is StoreShape {
  if (!value || typeof value !== 'object') return false
  return STORE_KEYS.every((key) => Array.isArray((value as Record<string, unknown>)[key]))
}

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
  const { user, isLoading: authLoading } = useAuth()
  const [store, setStore] = useState<StoreShape>(loadInitial)
  const [remoteReady, setRemoteReady] = useState(false)
  const dirtyRef = useRef(false)
  const [changeVersion, setChangeVersion] = useState(0)
  const [isPersisting, setIsPersisting] = useState(false)
  const [persistenceError, setPersistenceError] = useState('')
  const loadedAccountRef = useRef<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    const accountId = user?.id ?? 'public'
    let active = true
    loadedAccountRef.current = null
    dirtyRef.current = false

    fetch(user ? '/api/admin/content' : '/api/public/content', {
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`)
        return response.json() as Promise<unknown>
      })
      .then((remoteStore) => {
        if (!active) return
        if (remoteStore !== null) {
          if (!isStoreShape(remoteStore)) throw new Error('Le contenu reçu du serveur est invalide.')
          setStore((current) => ({ ...current, ...remoteStore }))
        }
        loadedAccountRef.current = accountId
        setPersistenceError('')
        setRemoteReady(true)
      })
      .catch((error: unknown) => {
        console.error('Erreur lors du chargement des contenus depuis le serveur :', error)
        if (!active) return
        loadedAccountRef.current = accountId
        setPersistenceError(user ? 'Impossible de charger le contenu du serveur.' : '')
        setRemoteReady(true)
      })

    return () => {
      active = false
    }
  }, [authLoading, user])

  useEffect(() => {
    if (!user || !remoteReady || !dirtyRef.current || loadedAccountRef.current !== user.id) return
    let active = true
    setIsPersisting(true)
    dirtyRef.current = false

    fetch('/api/admin/content', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(store),
    })
      .then(async (response) => {
        if (!response.ok) {
          const body = await response.json().catch(() => null) as { error?: string } | null
          throw new Error(body?.error || `Erreur HTTP ${response.status}`)
        }
        if (active) setPersistenceError('')
      })
      .catch((error: unknown) => {
        console.error('Erreur lors de l’enregistrement des contenus :', error)
        if (active) setPersistenceError(error instanceof Error ? error.message : 'Impossible d’enregistrer le contenu.')
      })
      .finally(() => {
        if (active) setIsPersisting(false)
      })

    return () => {
      active = false
    }
  }, [changeVersion, remoteReady, store, user])

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(store))
    } catch {
      // quota dépassé : on ignore silencieusement
    }
  }, [store])

  const markDirty = () => {
    dirtyRef.current = true
    setChangeVersion((version) => version + 1)
  }

  const value = useMemo<DataContextValue>(() => {
    const publishedArticles = store.articles
      .filter((a) => a.status === 'publie')
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return {
      ...store,
      isPersisting,
      persistenceError,
      publishedArticles,
      saveArticle: (article) => {
        markDirty()
        setStore((s) => {
          const exists = s.articles.some((a) => a.id === article.id)
          return {
            ...s,
            articles: exists
              ? s.articles.map((a) => (a.id === article.id ? article : a))
              : [article, ...s.articles],
          }
        })
      },
      deleteArticle: (id) => {
        markDirty()
        setStore((s) => ({ ...s, articles: s.articles.filter((a) => a.id !== id) }))
      },
      toggleArticleStatus: (id) => {
        markDirty()
        setStore((s) => ({
          ...s,
          articles: s.articles.map((a) =>
            a.id === id ? { ...a, status: a.status === 'publie' ? 'brouillon' : 'publie' } : a,
          ),
        }))
      },
      saveItem: (key, item) => {
        markDirty()
        setStore((s) => {
          const list = s[key] as { id: string }[]
          const exists = list.some((x) => x.id === item.id)
          return {
            ...s,
            [key]: exists ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list],
          }
        })
      },
      deleteItem: (key, id) => {
        markDirty()
        setStore((s) => ({
          ...s,
          [key]: (s[key] as { id: string }[]).filter((x) => x.id !== id),
        }))
      },
      resetDemo: () => {
        localStorage.removeItem(LS_KEY)
        markDirty()
        setStore(loadInitial())
      },
    }
  }, [isPersisting, persistenceError, store])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
