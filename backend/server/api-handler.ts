import { randomBytes, randomUUID } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { Feed, Podcast, PodcastEpisode, Setting, UserRole, UserStatus } from '../../frontend/src/types/admin'
import { getDatabase } from './db'
import {
  ApiError,
  createSession,
  deleteSession,
  enforceSameOrigin,
  getAuthenticatedUser,
  getClientAddressHash,
  hashPassword,
  initializeApplication,
  requirePermission,
  requireSuperAdmin,
  ROLE_PERMISSIONS,
  setSessionCookie,
  clearSessionCookie,
  verifyPassword,
} from './security'

const CONTENT_KEYS = ['articles', 'categories', 'authors', 'shows', 'videos', 'podcasts', 'events'] as const
const CONTENT_PERMISSIONS: Record<(typeof CONTENT_KEYS)[number], string> = {
  articles: 'articles:update',
  categories: 'categories:update',
  authors: 'authors:update',
  shows: 'shows:update',
  videos: 'videos:update',
  podcasts: 'podcasts:update',
  events: 'events:update',
}
const FEED_TYPES = ['RADIO_LIVE', 'PODCAST_RSS', 'NEWS_RSS', 'YOUTUBE', 'OTHER'] as const
const ROLES: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'ANIMATOR', 'USER']

function respond(res: VercelResponse, status: number, body: unknown) {
  return res.status(status).json(body)
}

function parseBody(req: VercelRequest): Record<string, unknown> {
  if (typeof req.body === 'string') {
    try {
      const body: unknown = JSON.parse(req.body)
      if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>
    } catch {
      throw new ApiError(400, 'Corps JSON invalide.')
    }
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body as Record<string, unknown>
  }
  throw new ApiError(400, 'Un objet JSON est requis.')
}

function requiredString(body: Record<string, unknown>, key: string, maxLength = 500): string {
  const value = body[key]
  if (typeof value !== 'string' || value.trim().length === 0 || value.length > maxLength) {
    throw new ApiError(400, `Le champ « ${key} » est obligatoire (maximum ${maxLength} caractères).`)
  }
  return value.trim()
}

function optionalString(body: Record<string, unknown>, key: string, maxLength = 500): string | undefined {
  const value = body[key]
  if (value === undefined) return undefined
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new ApiError(400, `Le champ « ${key} » est invalide.`)
  }
  return value.trim()
}

function normalizePath(req: VercelRequest) {
  const pathname = new URL(req.url || '/', `https://${req.headers.host || 'localhost'}`).pathname
  return pathname.replace(/\/+$/, '') || '/'
}

function publicUser(row: {
  id: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  status: UserStatus
  created_at: Date | string
  last_login_at: Date | string | null
}) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    ...(row.last_login_at ? { lastLoginAt: new Date(row.last_login_at).toISOString() } : {}),
  }
}

function validateFeed(body: Record<string, unknown>, id: string, createdAt?: string): Feed {
  const type = requiredString(body, 'type', 30)
  if (!FEED_TYPES.includes(type as Feed['type'])) throw new ApiError(400, 'Type de flux invalide.')
  const url = requiredString(body, 'url', 2048)
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new ApiError(400, 'URL de flux invalide.')
  }
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new ApiError(400, 'L’URL du flux doit être une adresse HTTP(S) valide.')
  }
  const status = body.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
  const syncFrequency = Number(body.syncFrequency ?? 60)
  if (!Number.isInteger(syncFrequency) || syncFrequency < 5 || syncFrequency > 10080) {
    throw new ApiError(400, 'La fréquence de synchronisation doit être comprise entre 5 et 10 080 minutes.')
  }
  return {
    id,
    name: requiredString(body, 'name', 160),
    type: type as Feed['type'],
    url: parsedUrl.toString(),
    description: optionalString(body, 'description', 2000),
    status,
    syncFrequency,
    createdAt: createdAt || new Date().toISOString(),
  }
}

function validatePodcast(body: Record<string, unknown>, id: string, createdAt?: string, updatedAt?: string): Podcast {
  const status = body.status
  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(String(status))) {
    throw new ApiError(400, 'Statut de podcast invalide.')
  }
  const feedId = optionalString(body, 'feedId', 200)
  return {
    id,
    title: requiredString(body, 'title', 200),
    description: optionalString(body, 'description', 5000),
    imageUrl: optionalString(body, 'imageUrl', 2048),
    category: optionalString(body, 'category', 100),
    author: optionalString(body, 'author', 160),
    language: optionalString(body, 'language', 20) || 'fr',
    audioUrl: optionalString(body, 'audioUrl', 2048),
    duration: optionalString(body, 'duration', 40),
    status: status as Podcast['status'],
    ...(feedId ? { feedId } : {}),
    createdAt: createdAt || new Date().toISOString(),
    updatedAt: updatedAt || new Date().toISOString(),
  }
}

function validateEpisode(body: Record<string, unknown>, id: string, podcastId: string, guid?: string): PodcastEpisode {
  const status = body.status
  if (status !== 'DRAFT' && status !== 'PUBLISHED') throw new ApiError(400, 'Statut d’épisode invalide.')
  const audioUrl = requiredString(body, 'audioUrl', 2048)
  let parsedUrl: URL
  try {
    parsedUrl = new URL(audioUrl)
  } catch {
    throw new ApiError(400, 'URL audio invalide.')
  }
  if (!['https:', 'http:'].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new ApiError(400, 'L’URL audio doit être une adresse HTTP(S) valide.')
  }
  const rawDuration = body.duration
  const duration = rawDuration === undefined || rawDuration === '' ? undefined : Number(rawDuration)
  if (duration !== undefined && (!Number.isFinite(duration) || duration <= 0 || duration > 86400)) {
    throw new ApiError(400, 'La durée doit être comprise entre 1 seconde et 24 heures.')
  }
  const publishedAt = optionalString(body, 'publishedAt', 40)
  if (publishedAt && !Number.isFinite(Date.parse(publishedAt))) throw new ApiError(400, 'Date de publication invalide.')
  return {
    id,
    podcastId,
    title: requiredString(body, 'title', 200),
    description: optionalString(body, 'description', 5000),
    audioUrl: parsedUrl.toString(),
    ...(duration !== undefined ? { duration } : {}),
    ...(publishedAt ? { publishedAt: new Date(publishedAt).toISOString() } : {}),
    guid: guid || optionalString(body, 'guid', 500) || id,
    status,
  }
}

async function handleAuth(req: VercelRequest, res: VercelResponse, path: string) {
  const sql = getDatabase()

  if (path === '/api/auth/login' && req.method === 'POST') {
    enforceSameOrigin(req)
    const body = parseBody(req)
    const email = requiredString(body, 'email', 254).toLowerCase()
    const password = requiredString(body, 'password', 1024)
    const addressHash = getClientAddressHash(req)
    const [attempts] = await sql`
      SELECT count(*)::int AS count
      FROM login_attempts
      WHERE address_hash = ${addressHash}
        AND attempted_at > now() - interval '15 minutes'
    `
    if (Number(attempts?.count ?? 0) >= 10) throw new ApiError(429, 'Trop de tentatives. Réessayez dans 15 minutes.')

    const [user] = await sql`
      SELECT id, first_name, last_name, email, password_hash, role, status, permissions, created_at, last_login_at
      FROM admin_users WHERE email = ${email}
    `
    if (!user || user.status !== 'ACTIVE' || !(await verifyPassword(password, user.password_hash))) {
      await sql`INSERT INTO login_attempts (address_hash) VALUES (${addressHash})`
      throw new ApiError(401, 'Email ou mot de passe incorrect.')
    }

    await sql`DELETE FROM login_attempts WHERE address_hash = ${addressHash}`
    await sql`UPDATE admin_users SET last_login_at = now() WHERE id = ${user.id}`
    const { token, maxAge } = await createSession(user.id)
    setSessionCookie(res, token, maxAge)
    const permissions = Array.isArray(user.permissions) ? user.permissions : ROLE_PERMISSIONS[user.role as UserRole]
    return respond(res, 200, {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role,
        status: user.status,
        permissions,
        createdAt: new Date(user.created_at).toISOString(),
      },
    })
  }

  if (path === '/api/auth/me' && req.method === 'GET') {
    const user = await getAuthenticatedUser(req)
    if (!user) return respond(res, 200, { user: null })
    return respond(res, 200, { user })
  }

  if (path === '/api/auth/logout' && req.method === 'POST') {
    enforceSameOrigin(req)
    const user = await getAuthenticatedUser(req)
    await deleteSession(req)
    clearSessionCookie(res)
    return respond(res, 200, { ok: true, user: user?.id ?? null })
  }

  throw new ApiError(404, 'Route introuvable.')
}

async function handleUsers(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const sql = getDatabase()
  const match = path.match(/^\/api\/admin\/users(?:\/([^/]+)(?:\/(status|reset-password))?)?$/)
  if (!match) throw new ApiError(404, 'Route introuvable.')
  const id = match[1] ? decodeURIComponent(match[1]) : undefined
  const action = match[2]

  if (!id && req.method === 'GET') {
    requirePermission(user, 'users:read')
    const users = await sql`
      SELECT id, first_name, last_name, email, role, status, created_at, last_login_at
      FROM admin_users ORDER BY created_at DESC
    `
    return respond(res, 200, users.map((entry) => publicUser(entry as Parameters<typeof publicUser>[0])))
  }

  if (!id && req.method === 'POST') {
    requirePermission(user, 'users:create')
    const body = parseBody(req)
    const role = requiredString(body, 'role', 30) as UserRole
    if (!ROLES.includes(role)) throw new ApiError(400, 'Rôle invalide.')
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') requireSuperAdmin(user)
    const email = requiredString(body, 'email', 254).toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Adresse e-mail invalide.')
    const password = requiredString(body, 'password', 1024)
    if (password.length < 12) throw new ApiError(400, 'Le mot de passe doit contenir au moins 12 caractères.')
    const newId = randomUUID()
    const passwordHash = await hashPassword(password)
    const status = body.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const firstName = requiredString(body, 'firstName', 100)
    const lastName = requiredString(body, 'lastName', 100)
    const permissions = ROLE_PERMISSIONS[role]
    try {
      const [created] = await sql`
        INSERT INTO admin_users (id, first_name, last_name, email, password_hash, role, status, permissions)
        VALUES (${newId}, ${firstName}, ${lastName}, ${email}, ${passwordHash}, ${role}, ${status}, ${JSON.stringify(permissions)}::jsonb)
        RETURNING id, first_name, last_name, email, role, status, created_at, last_login_at
      `
      return respond(res, 201, publicUser(created as Parameters<typeof publicUser>[0]))
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23505') {
        throw new ApiError(409, 'Cette adresse e-mail est déjà utilisée.')
      }
      throw error
    }
  }

  if (!id) throw new ApiError(404, 'Utilisateur introuvable.')
  const [target] = await sql`
    SELECT id, first_name, last_name, email, role, status, created_at, last_login_at
    FROM admin_users WHERE id = ${id}
  `
  if (!target) throw new ApiError(404, 'Utilisateur introuvable.')
  if (target.role === 'SUPER_ADMIN') requireSuperAdmin(user)

  if (action === 'status' && req.method === 'PATCH') {
    requirePermission(user, 'users:update')
    if (id === user?.id) throw new ApiError(400, 'Vous ne pouvez pas désactiver votre propre compte.')
    const body = parseBody(req)
    if (body.status !== 'ACTIVE' && body.status !== 'INACTIVE') throw new ApiError(400, 'Statut invalide.')
    if (target.role === 'SUPER_ADMIN' && body.status === 'INACTIVE') {
      const [remaining] = await sql`
        SELECT count(*)::int AS count FROM admin_users
        WHERE role = 'SUPER_ADMIN' AND status = 'ACTIVE' AND id <> ${id}
      `
      if (Number(remaining?.count ?? 0) === 0) throw new ApiError(409, 'Impossible de désactiver le dernier Super Admin actif.')
    }
    await sql`UPDATE admin_users SET status = ${body.status} WHERE id = ${id}`
    return respond(res, 200, { ok: true })
  }

  if (action === 'reset-password' && req.method === 'POST') {
    requirePermission(user, 'users:update')
    const temporaryPassword = randomBytes(9).toString('base64url')
    const passwordHash = await hashPassword(temporaryPassword)
    await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE id = ${id}`
    await sql`DELETE FROM admin_sessions WHERE user_id = ${id}`
    return respond(res, 200, { temporaryPassword })
  }

  if (req.method === 'PUT') {
    requirePermission(user, 'users:update')
    const body = parseBody(req)
    const role = requiredString(body, 'role', 30) as UserRole
    if (!ROLES.includes(role)) throw new ApiError(400, 'Rôle invalide.')
    if (role === 'SUPER_ADMIN' || role === 'ADMIN' || target.role === 'SUPER_ADMIN') requireSuperAdmin(user)
    const status = body.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE'
    const firstName = requiredString(body, 'firstName', 100)
    const lastName = requiredString(body, 'lastName', 100)
    const email = requiredString(body, 'email', 254).toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Adresse e-mail invalide.')
    const permissions = ROLE_PERMISSIONS[role]
    const password = optionalString(body, 'password', 1024)
    if (password && password.length < 12) throw new ApiError(400, 'Le mot de passe doit contenir au moins 12 caractères.')
    if (target.role === 'SUPER_ADMIN' && (role !== 'SUPER_ADMIN' || status !== 'ACTIVE')) {
      const [remaining] = await sql`
        SELECT count(*)::int AS count FROM admin_users
        WHERE role = 'SUPER_ADMIN' AND status = 'ACTIVE' AND id <> ${id}
      `
      if (Number(remaining?.count ?? 0) === 0) throw new ApiError(409, 'Impossible de retirer le dernier Super Admin actif.')
    }
    const updated = await sql.begin(async (transaction) => {
      if (password) {
        const passwordHash = await hashPassword(password)
        return transaction`
          UPDATE admin_users
          SET first_name = ${firstName}, last_name = ${lastName}, email = ${email},
              role = ${role}, status = ${status}, permissions = ${JSON.stringify(permissions)}::jsonb,
              password_hash = ${passwordHash}
          WHERE id = ${id}
          RETURNING id, first_name, last_name, email, role, status, created_at, last_login_at
        `
      }
      return transaction`
        UPDATE admin_users
        SET first_name = ${firstName}, last_name = ${lastName}, email = ${email},
            role = ${role}, status = ${status}, permissions = ${JSON.stringify(permissions)}::jsonb
        WHERE id = ${id}
        RETURNING id, first_name, last_name, email, role, status, created_at, last_login_at
      `
    })
    if (password || status === 'INACTIVE') await sql`DELETE FROM admin_sessions WHERE user_id = ${id}`
    return respond(res, 200, publicUser(updated[0] as Parameters<typeof publicUser>[0]))
  }

  if (req.method === 'DELETE') {
    requireSuperAdmin(user)
    if (id === user?.id) throw new ApiError(400, 'Vous ne pouvez pas supprimer votre propre compte.')
    if (target.role === 'SUPER_ADMIN' && target.status === 'ACTIVE') {
      const [remaining] = await sql`
        SELECT count(*)::int AS count FROM admin_users
        WHERE role = 'SUPER_ADMIN' AND status = 'ACTIVE' AND id <> ${id}
      `
      if (Number(remaining?.count ?? 0) === 0) throw new ApiError(409, 'Impossible de supprimer le dernier Super Admin actif.')
    }
    await sql`DELETE FROM admin_users WHERE id = ${id}`
    return respond(res, 200, { ok: true })
  }

  throw new ApiError(405, 'Méthode non autorisée.')
}

async function handleSettings(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const sql = getDatabase()
  if (path === '/api/public/settings' && req.method === 'GET') {
    const settings = await sql`SELECT key, category, label, value FROM site_settings ORDER BY key`
    return respond(res, 200, settings.map((setting) => ({ ...setting, id: setting.key })))
  }
  if (path !== '/api/admin/settings') throw new ApiError(404, 'Route introuvable.')
  if (req.method === 'GET') {
    requirePermission(user, 'settings:read')
    const settings = await sql`SELECT key, category, label, value FROM site_settings ORDER BY key`
    return respond(res, 200, settings.map((setting) => ({ ...setting, id: setting.key })))
  }
  if (req.method === 'PUT') {
    enforceSameOrigin(req)
    requirePermission(user, 'settings:update')
    if (!Array.isArray(req.body)) throw new ApiError(400, 'Une liste de paramètres est requise.')
    const values = req.body as Partial<Setting>[]
    const allowed = await sql`SELECT key FROM site_settings`
    const allowedKeys = new Set(allowed.map((row) => row.key as string))
    for (const setting of values) {
      if (typeof setting.key !== 'string' || !allowedKeys.has(setting.key) || typeof setting.value !== 'string' || setting.value.length > 5000) {
        throw new ApiError(400, 'La liste contient un paramètre invalide.')
      }
      if (setting.value) {
        const isUrl = setting.key.startsWith('social.') || setting.key.endsWith('.url') || setting.key === 'podcast.feedUrl'
        if (isUrl) {
          let parsed: URL
          try {
            parsed = new URL(setting.value)
          } catch {
            throw new ApiError(400, `L’adresse associée au paramètre « ${setting.key} » est invalide.`)
          }
          const secureOnly = setting.key.startsWith('social.') || setting.key === 'podcast.feedUrl'
          if (!['http:', 'https:'].includes(parsed.protocol) || (secureOnly && parsed.protocol !== 'https:') || parsed.username || parsed.password) {
            throw new ApiError(400, `L’adresse associée au paramètre « ${setting.key} » doit être une URL ${secureOnly ? 'HTTPS' : 'HTTP(S)'} valide.`)
          }
        }
        if (setting.key === 'site.email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(setting.value)) {
          throw new ApiError(400, 'Adresse e-mail invalide.')
        }
      }
    }
    await sql.begin(async (transaction) => {
      for (const setting of values) {
        await transaction`UPDATE site_settings SET value = ${setting.value!} WHERE key = ${setting.key!}`
      }
    })
    const settings = await sql`SELECT key, category, label, value FROM site_settings ORDER BY key`
    return respond(res, 200, settings.map((setting) => ({ ...setting, id: setting.key })))
  }
  throw new ApiError(405, 'Méthode non autorisée.')
}

async function handleContent(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const sql = getDatabase()
  const isAdmin = path === '/api/admin/content'
  if (!isAdmin && path !== '/api/public/content') throw new ApiError(404, 'Route introuvable.')
  if (req.method === 'GET') {
    if (isAdmin) requirePermission(user, 'articles:read')
    const [document] = await sql`SELECT value FROM content_documents WHERE key = 'main'`
    const content = document?.value
    if (!content) return respond(res, 200, null)
    if (!isAdmin && Array.isArray(content.articles)) {
      return respond(res, 200, {
        ...content,
        articles: content.articles.filter((article: { status?: string }) => article.status === 'publie'),
      })
    }
    return respond(res, 200, content)
  }
  if (isAdmin && req.method === 'PUT') {
    enforceSameOrigin(req)
    requirePermission(user, 'articles:update')
    const body = parseBody(req)
    const content: Record<string, unknown[]> = {}
    if (JSON.stringify(body).length > 2_000_000) throw new ApiError(413, 'Le contenu dépasse la taille maximale autorisée.')
    for (const key of CONTENT_KEYS) {
      if (!Array.isArray(body[key])) throw new ApiError(400, `Le contenu « ${key} » doit être une liste.`)
      content[key] = body[key]
    }
    const [existing] = await sql`SELECT value FROM content_documents WHERE key = 'main'`
    for (const key of CONTENT_KEYS) {
      if (JSON.stringify(existing?.value?.[key] ?? []) !== JSON.stringify(content[key])) {
        requirePermission(user, CONTENT_PERMISSIONS[key])
      }
    }
    await sql`
      INSERT INTO content_documents (key, value, updated_at)
      VALUES ('main', ${JSON.stringify(content)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
    `
    return respond(res, 200, { ok: true })
  }
  throw new ApiError(405, 'Méthode non autorisée.')
}

async function handleStats(req: VercelRequest, res: VercelResponse, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  if (req.method !== 'GET') throw new ApiError(405, 'Méthode non autorisée.')
  requirePermission(user, 'articles:read')
  const sql = getDatabase()
  const [[users], [feeds], [podcasts], [document]] = await Promise.all([
    sql`SELECT count(*)::int AS count FROM admin_users`,
    sql`SELECT count(*)::int AS count FROM admin_feeds`,
    sql`SELECT count(*)::int AS count FROM admin_podcasts`,
    sql`SELECT value FROM content_documents WHERE key = 'main'`,
  ])
  const content = document?.value ?? {}
  const articles = Array.isArray(content.articles) ? content.articles : []
  const videos = Array.isArray(content.videos) ? content.videos : []
  const shows = Array.isArray(content.shows) ? content.shows : []
  return respond(res, 200, {
    usersCount: Number(users?.count ?? 0),
    feedsCount: Number(feeds?.count ?? 0),
    podcastsCount: Number(podcasts?.count ?? 0),
    showsCount: shows.length,
    contentsCount: articles.length + videos.length + shows.length + Number(podcasts?.count ?? 0),
    publicationsCount: articles.filter((article: { status?: string }) => article.status === 'publie').length,
    activeFeeds: 0,
  })
}

async function handleFeeds(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const sql = getDatabase()
  const match = path.match(/^\/api\/admin\/feeds(?:\/([^/]+)(?:\/(sync))?)?$/)
  if (!match) throw new ApiError(404, 'Route introuvable.')
  const id = match[1] ? decodeURIComponent(match[1]) : undefined
  const action = match[2]

  if (!id && req.method === 'GET') {
    requirePermission(user, 'feeds:read')
    const rows = await sql`SELECT data FROM admin_feeds ORDER BY created_at DESC`
    return respond(res, 200, rows.map((row) => row.data))
  }
  if (!id && req.method === 'POST') {
    enforceSameOrigin(req)
    requirePermission(user, 'feeds:create')
    const feed = validateFeed(parseBody(req), randomUUID())
    await sql`INSERT INTO admin_feeds (id, data) VALUES (${feed.id}, ${JSON.stringify(feed)}::jsonb)`
    return respond(res, 201, feed)
  }
  if (!id) throw new ApiError(404, 'Flux introuvable.')
  const [row] = await sql`SELECT data FROM admin_feeds WHERE id = ${id}`
  if (!row) throw new ApiError(404, 'Flux introuvable.')
  if (action === 'sync' && req.method === 'POST') {
    requirePermission(user, 'feeds:sync')
    throw new ApiError(501, 'La synchronisation RSS automatique nécessite la configuration d’un parseur et d’une tâche planifiée.')
  }
  if (req.method === 'PUT') {
    enforceSameOrigin(req)
    requirePermission(user, 'feeds:update')
    const feed = validateFeed(parseBody(req), id, row.data.createdAt)
    await sql`UPDATE admin_feeds SET data = ${JSON.stringify(feed)}::jsonb, updated_at = now() WHERE id = ${id}`
    return respond(res, 200, feed)
  }
  if (req.method === 'DELETE') {
    enforceSameOrigin(req)
    requirePermission(user, 'feeds:delete')
    await sql`DELETE FROM admin_feeds WHERE id = ${id}`
    return respond(res, 200, { ok: true })
  }
  throw new ApiError(405, 'Méthode non autorisée.')
}

function publicPodcast(row: Podcast) {
  return {
    id: row.id,
    title: row.title,
    show: row.author || 'Radio Douvanjou',
    cover: row.imageUrl || '',
    description: row.description || '',
    duration: row.duration || '',
    date: row.updatedAt,
    audioUrl: row.audioUrl || '',
    category: row.category || '',
  }
}

async function handlePodcasts(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const sql = getDatabase()
  if (path === '/api/public/podcasts' && req.method === 'GET') {
    const rows = await sql`SELECT data FROM admin_podcasts WHERE data->>'status' = 'PUBLISHED' ORDER BY created_at DESC`
    return respond(res, 200, rows.map((row) => publicPodcast(row.data as Podcast)))
  }
  const match = path.match(/^\/api\/admin\/podcasts(?:\/([^/]+))?$/)
  if (!match) throw new ApiError(404, 'Route introuvable.')
  const id = match[1] ? decodeURIComponent(match[1]) : undefined
  if (!id && req.method === 'GET') {
    requirePermission(user, 'podcasts:read')
    const rows = await sql`SELECT data FROM admin_podcasts ORDER BY created_at DESC`
    return respond(res, 200, rows.map((row) => row.data))
  }
  if (!id && req.method === 'POST') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:create')
    const podcast = validatePodcast(parseBody(req), randomUUID())
    await sql`INSERT INTO admin_podcasts (id, data) VALUES (${podcast.id}, ${JSON.stringify(podcast)}::jsonb)`
    return respond(res, 201, podcast)
  }
  if (!id) throw new ApiError(404, 'Podcast introuvable.')
  const [row] = await sql`SELECT data FROM admin_podcasts WHERE id = ${id}`
  if (!row) throw new ApiError(404, 'Podcast introuvable.')
  if (req.method === 'GET') {
    requirePermission(user, 'podcasts:read')
    return respond(res, 200, row.data)
  }
  if (req.method === 'PUT') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:update')
    const podcast = validatePodcast(parseBody(req), id, row.data.createdAt)
    await sql`UPDATE admin_podcasts SET data = ${JSON.stringify(podcast)}::jsonb, updated_at = now() WHERE id = ${id}`
    return respond(res, 200, podcast)
  }
  if (req.method === 'DELETE') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:delete')
    await sql`DELETE FROM admin_podcasts WHERE id = ${id}`
    return respond(res, 200, { ok: true })
  }
  throw new ApiError(405, 'Méthode non autorisée.')
}

async function handleEpisodes(req: VercelRequest, res: VercelResponse, path: string, user: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  const match = path.match(/^\/api\/admin\/podcasts\/([^/]+)\/episodes(?:\/([^/]+))?$/)
  if (!match) throw new ApiError(404, 'Route introuvable.')
  const podcastId = decodeURIComponent(match[1])
  const episodeId = match[2] ? decodeURIComponent(match[2]) : undefined
  const sql = getDatabase()
  const [podcast] = await sql`SELECT id FROM admin_podcasts WHERE id = ${podcastId}`
  if (!podcast) throw new ApiError(404, 'Podcast introuvable.')

  if (!episodeId && req.method === 'GET') {
    requirePermission(user, 'podcasts:read')
    const episodes = await sql`
      SELECT data FROM admin_podcast_episodes
      WHERE podcast_id = ${podcastId}
      ORDER BY created_at DESC
    `
    return respond(res, 200, episodes.map((episode) => episode.data))
  }

  if (!episodeId && req.method === 'POST') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:create')
    const episode = validateEpisode(parseBody(req), randomUUID(), podcastId)
    await sql`INSERT INTO admin_podcast_episodes (id, podcast_id, data) VALUES (${episode.id}, ${podcastId}, ${JSON.stringify(episode)}::jsonb)`
    const [count] = await sql`SELECT count(*)::int AS count FROM admin_podcast_episodes WHERE podcast_id = ${podcastId}`
    await sql`UPDATE admin_podcasts SET data = jsonb_set(data, '{episodeCount}', to_jsonb(${Number(count?.count ?? 0)}::int), true) WHERE id = ${podcastId}`
    return respond(res, 201, episode)
  }

  if (!episodeId) throw new ApiError(404, 'Épisode introuvable.')
  const [existing] = await sql`
    SELECT data FROM admin_podcast_episodes
    WHERE id = ${episodeId} AND podcast_id = ${podcastId}
  `
  if (!existing) throw new ApiError(404, 'Épisode introuvable.')

  if (req.method === 'PUT') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:update')
    const episode = validateEpisode(parseBody(req), episodeId, podcastId, existing.data.guid)
    await sql`UPDATE admin_podcast_episodes SET data = ${JSON.stringify(episode)}::jsonb, updated_at = now() WHERE id = ${episodeId}`
    return respond(res, 200, episode)
  }

  if (req.method === 'DELETE') {
    enforceSameOrigin(req)
    requirePermission(user, 'podcasts:delete')
    await sql`DELETE FROM admin_podcast_episodes WHERE id = ${episodeId}`
    const [count] = await sql`SELECT count(*)::int AS count FROM admin_podcast_episodes WHERE podcast_id = ${podcastId}`
    await sql`UPDATE admin_podcasts SET data = jsonb_set(data, '{episodeCount}', to_jsonb(${Number(count?.count ?? 0)}::int), true) WHERE id = ${podcastId}`
    return respond(res, 200, { ok: true })
  }

  throw new ApiError(405, 'Méthode non autorisée.')
}

export default async function apiHandler(req: VercelRequest, res: VercelResponse) {
  try {
    await initializeApplication()
    const path = normalizePath(req)

    if (path.startsWith('/api/auth/')) return await handleAuth(req, res, path)
    if (req.method !== 'GET' && req.method !== 'HEAD') enforceSameOrigin(req)
    const user = await getAuthenticatedUser(req)

    if (path.startsWith('/api/admin/users')) return await handleUsers(req, res, path, user)
    if (path === '/api/admin/settings' || path === '/api/public/settings') return await handleSettings(req, res, path, user)
    if (path === '/api/admin/content' || path === '/api/public/content') return await handleContent(req, res, path, user)
    if (path === '/api/admin/stats') return await handleStats(req, res, user)
    if (path.startsWith('/api/admin/feeds')) return await handleFeeds(req, res, path, user)
    if (/^\/api\/admin\/podcasts\/[^/]+\/episodes(?:\/|$)/.test(path)) return await handleEpisodes(req, res, path, user)
    if (path === '/api/public/podcasts' || path.startsWith('/api/admin/podcasts')) return await handlePodcasts(req, res, path, user)

    throw new ApiError(404, 'Route introuvable.')
  } catch (error) {
    if (error instanceof ApiError) return respond(res, error.status, { error: error.message })
    console.error('Erreur API :', error)
    if (error instanceof Error && ['POSTGRES_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].some((key) => error.message.includes(key))) {
      return respond(res, 503, { error: error.message })
    }
    return respond(res, 500, { error: 'Erreur interne du serveur.' })
  }
}
