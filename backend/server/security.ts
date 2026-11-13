import { createHash, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDatabase, initializeDatabase } from './db'
import type { UserRole } from '../../frontend/src/types/admin'

const scrypt = promisify(scryptCallback)
const SESSION_COOKIE = 'rdm_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

export interface AuthenticatedUser {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  lastLoginAt?: string
}

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['*'],
  EDITOR: [
    'articles:create', 'articles:read', 'articles:update',
    'shows:create', 'shows:read', 'shows:update',
    'podcasts:create', 'podcasts:read', 'podcasts:update',
    'videos:create', 'videos:read', 'videos:update',
    'events:create', 'events:read', 'events:update',
    'categories:create', 'categories:read', 'categories:update',
    'authors:create', 'authors:read', 'authors:update',
  ],
  ANIMATOR: ['shows:own', 'podcasts:own', 'medias:own'],
  USER: ['profile:read'],
}

const DEFAULT_SETTINGS = [
  ['site.name', 'GENERAL', 'Nom du site', 'Radio Télévision Douvanjou'],
  ['site.tagline', 'GENERAL', 'Slogan', "L'info haïtienne, en direct et en profondeur"],
  ['site.description', 'GENERAL', 'Description', "Radio Télévision Douvanjou : actualités, radio et TV en direct, vidéos, podcasts, émissions, culture, sport et événements d'Haïti et de la diaspora."],
  ['site.email', 'GENERAL', 'Adresse e-mail', 'contact@radiodouvanjou.com'],
  ['site.phone', 'GENERAL', 'Téléphone', '+509 44 44 4444'],
  ['site.address', 'GENERAL', 'Adresse', 'Port-au-Prince, Haïti'],
  ['social.facebook', 'SOCIAL', 'Facebook', 'https://facebook.com/radiodouvanjou'],
  ['social.twitter', 'SOCIAL', 'X / Twitter', 'https://x.com/radiodouvanjou'],
  ['social.instagram', 'SOCIAL', 'Instagram', 'https://instagram.com/radiodouvanjou'],
  ['social.youtube', 'SOCIAL', 'YouTube', 'https://youtube.com/@radiodouvanjou'],
  ['radio.name', 'RADIO', 'Nom de la radio', 'Radio Télévision Douvanjou'],
  ['radio.url', 'RADIO', 'URL du flux radio', 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service'],
  ['tv.name', 'RADIO', 'Nom de la chaîne TV', 'Douvanjou TV'],
  ['tv.url', 'RADIO', 'URL du flux TV (HLS)', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'],
  ['podcast.description', 'PODCAST', 'Présentation des podcasts', 'Réécoutez les émissions et les grands entretiens de Radio Télévision Douvanjou, où que vous soyez.'],
  ['podcast.feedUrl', 'PODCAST', 'URL du flux RSS', ''],
]

export async function initializeApplication() {
  await initializeDatabase()
  const sql = getDatabase()
  for (const [key, category, label, value] of DEFAULT_SETTINGS) {
    await sql`
      INSERT INTO site_settings (key, category, label, value)
      VALUES (${key}, ${category}, ${label}, ${value})
      ON CONFLICT (key) DO NOTHING
    `
  }

  await sql`
    UPDATE site_settings
    SET value = 'Radio Télévision Douvanjou'
    WHERE key = 'site.name' AND value = 'Radio Douvanjou Media'
  `
  await sql`
    UPDATE site_settings
    SET value = ${"Radio Télévision Douvanjou : actualités, radio et TV en direct, vidéos, podcasts, émissions, culture, sport et événements d'Haïti et de la diaspora."}
    WHERE key = 'site.description'
      AND value = ${"Radio Douvanjou Media : actualités, radio et TV en direct, vidéos, podcasts, émissions, culture, sport et événements d'Haïti et de la diaspora."}
  `
  await sql`
    UPDATE site_settings
    SET value = 'Radio Télévision Douvanjou'
    WHERE key = 'radio.name' AND value = 'Radio Douvanjou — 94.5 FM'
  `
  await sql`
    UPDATE site_settings
    SET value = ${'Réécoutez les émissions et les grands entretiens de Radio Télévision Douvanjou, où que vous soyez.'}
    WHERE key = 'podcast.description'
      AND value = ${'Réécoutez les émissions et les grands entretiens de Radio Douvanjou, où que vous soyez.'}
  `

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (Boolean(email) !== Boolean(password)) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être configurés ensemble.')
  }
  if (email && password) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('ADMIN_EMAIL doit contenir une adresse e-mail valide.')
    }
    if (password.length < 12) throw new Error('ADMIN_PASSWORD doit contenir au moins 12 caractères.')
    const [existing] = await sql`SELECT id FROM admin_users WHERE email = ${email}`
    if (!existing) {
      const passwordHash = await hashPassword(password)
      await sql`
        INSERT INTO admin_users (
          id, first_name, last_name, email, password_hash, role, status, permissions
        )
        VALUES (
          ${randomUUID()}, 'Administrateur', 'Principal', ${email},
          ${passwordHash}, 'SUPER_ADMIN', 'ACTIVE', ${JSON.stringify(ROLE_PERMISSIONS.SUPER_ADMIN)}::jsonb
        )
        ON CONFLICT (email) DO NOTHING
      `
    }
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const derived = await scrypt(password, salt, 64) as Buffer
  return `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex] = stored.split('$')
  if (algorithm !== 'scrypt' || !saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = await scrypt(password, salt, expected.length) as Buffer
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function getCookie(req: VercelRequest, name: string): string | undefined {
  const cookieHeader = req.headers.cookie
  if (!cookieHeader) return undefined
  const prefix = `${name}=`
  const value = cookieHeader.split(';').map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(prefix))
  return value ? decodeURIComponent(value.slice(prefix.length)) : undefined
}

export function setSessionCookie(res: VercelResponse, token: string, maxAge: number) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${secure}`,
  )
}

export function clearSessionCookie(res: VercelResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`)
}

function safeUser(row: {
  id: string
  first_name: string
  last_name: string
  email: string
  role: UserRole
  status: 'ACTIVE' | 'INACTIVE'
  permissions: string[]
  created_at: Date | string
  last_login_at: Date | string | null
}): AuthenticatedUser {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    name: `${row.first_name} ${row.last_name}`.trim(),
    email: row.email,
    role: row.role,
    status: row.status,
    permissions: row.permissions ?? ROLE_PERMISSIONS[row.role],
    createdAt: new Date(row.created_at).toISOString(),
    ...(row.last_login_at ? { lastLoginAt: new Date(row.last_login_at).toISOString() } : {}),
  }
}

export async function getAuthenticatedUser(req: VercelRequest): Promise<AuthenticatedUser | null> {
  const token = getCookie(req, SESSION_COOKIE)
  if (!token) return null
  const sql = getDatabase()
  const [row] = await sql`
    SELECT u.id, u.first_name, u.last_name, u.email, u.role, u.status, u.permissions,
           u.created_at, u.last_login_at
    FROM admin_sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.token_hash = ${hashToken(token)}
      AND s.expires_at > now()
      AND u.status = 'ACTIVE'
  `
  return row ? safeUser(row as Parameters<typeof safeUser>[0]) : null
}

export function requirePermission(user: AuthenticatedUser | null, permission: string) {
  if (!user) throw new ApiError(401, 'Connexion requise.')
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' || user.permissions.includes('*')) return
  if (!user.permissions.includes(permission)) throw new ApiError(403, 'Accès interdit.')
}

export function requireSuperAdmin(user: AuthenticatedUser | null) {
  if (!user) throw new ApiError(401, 'Connexion requise.')
  if (user.role !== 'SUPER_ADMIN') throw new ApiError(403, 'Réservé au Super Admin.')
}

export async function createSession(userId: string): Promise<{ token: string; maxAge: number }> {
  const token = randomBytes(32).toString('base64url')
  const maxAge = Math.floor(SESSION_TTL_MS / 1000)
  const sql = getDatabase()
  await sql`
    INSERT INTO admin_sessions (token_hash, user_id, expires_at)
    VALUES (${hashToken(token)}, ${userId}, ${new Date(Date.now() + SESSION_TTL_MS)})
  `
  return { token, maxAge }
}

export async function deleteSession(req: VercelRequest) {
  const token = getCookie(req, SESSION_COOKIE)
  if (!token) return
  const sql = getDatabase()
  await sql`DELETE FROM admin_sessions WHERE token_hash = ${hashToken(token)}`
}

export function enforceSameOrigin(req: VercelRequest) {
  const origin = req.headers.origin
  if (!origin) return
  const forwardedHost = req.headers['x-forwarded-host']
  const host = (Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost) || req.headers.host
  if (!host) throw new ApiError(403, 'Origine non autorisée.')
  try {
    if (new URL(origin).host !== host) throw new ApiError(403, 'Origine non autorisée.')
  } catch {
    throw new ApiError(403, 'Origine non autorisée.')
  }
}

export function getClientAddressHash(req: VercelRequest) {
  const forwarded = req.headers['x-forwarded-for']
  const address = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim()
  return createHash('sha256').update(address || 'unknown').digest('hex')
}

export { ROLE_PERMISSIONS }
