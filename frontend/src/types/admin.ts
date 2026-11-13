export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'ANIMATOR' | 'USER'

export type UserStatus = 'ACTIVE' | 'INACTIVE'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  lastLoginAt?: string
}

export interface Role {
  id: string
  name: UserRole
  label: string
  permissions: string[]
}

export interface Feed {
  id: string
  name: string
  type: 'RADIO_LIVE' | 'PODCAST_RSS' | 'NEWS_RSS' | 'YOUTUBE' | 'OTHER'
  url: string
  description?: string
  status: UserStatus
  syncFrequency: number // minutes
  lastSyncAt?: string
  createdAt: string
}

export interface Podcast {
  id: string
  title: string
  description?: string
  imageUrl?: string
  category?: string
  author?: string
  language: string
  audioUrl?: string
  duration?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  feedId?: string
  createdAt: string
  updatedAt: string
  episodeCount?: number
}

export interface PodcastEpisode {
  id: string
  podcastId: string
  title: string
  description?: string
  audioUrl: string
  duration?: number
  publishedAt?: string
  guid: string
  status: 'DRAFT' | 'PUBLISHED'
}

export interface Setting {
  id: string
  category: 'GENERAL' | 'SOCIAL' | 'RADIO' | 'PODCAST'
  key: string
  value: string
  label: string
}

export interface AuditLog {
  id: string
  userName: string
  action: string
  entity: string
  entityId?: string
  createdAt: string
}

export interface DashboardStats {
  usersCount: number
  contentsCount: number
  showsCount: number
  podcastsCount: number
  feedsCount: number
  publicationsCount: number
  activeFeeds: number
}