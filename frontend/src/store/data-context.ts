import { createContext } from 'react'
import type {
  Article,
  Category,
  Author,
  Show,
  Video,
  Podcast,
  EventItem,
} from '@/data'

export interface StoreShape {
  articles: Article[]
  categories: Category[]
  authors: Author[]
  shows: Show[]
  videos: Video[]
  podcasts: Podcast[]
  events: EventItem[]
}

export interface DataContextValue extends StoreShape {
  publishedArticles: Article[]
  isPersisting: boolean
  persistenceError: string
  saveArticle: (article: Article) => void
  deleteArticle: (id: string) => void
  toggleArticleStatus: (id: string) => void
  saveItem: <K extends keyof StoreShape>(key: K, item: StoreShape[K][number] & { id: string }) => void
  deleteItem: (key: keyof StoreShape, id: string) => void
  resetDemo: () => void
}

export const DataContext = createContext<DataContextValue | null>(null)
