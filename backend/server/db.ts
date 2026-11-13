import postgres from 'postgres'

let client: ReturnType<typeof postgres> | undefined
let schemaReady: Promise<void> | undefined

export function getDatabase() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('POSTGRES_URL ou DATABASE_URL doit être configuré.')
  }

  client ??= postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  })

  return client
}

export async function initializeDatabase() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getDatabase()
      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id text PRIMARY KEY,
          first_name text NOT NULL,
          last_name text NOT NULL,
          email text NOT NULL UNIQUE,
          password_hash text NOT NULL,
          role text NOT NULL CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'ANIMATOR', 'USER')),
          status text NOT NULL CHECK (status IN ('ACTIVE', 'INACTIVE')),
          permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
          created_at timestamptz NOT NULL DEFAULT now(),
          last_login_at timestamptz
        )
      `
      await sql`
        CREATE TABLE IF NOT EXISTS admin_sessions (
          token_hash text PRIMARY KEY,
          user_id text NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
          expires_at timestamptz NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx
        ON admin_sessions (expires_at)
      `
      await sql`
        CREATE TABLE IF NOT EXISTS login_attempts (
          address_hash text NOT NULL,
          attempted_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE INDEX IF NOT EXISTS login_attempts_recent_idx
        ON login_attempts (address_hash, attempted_at)
      `
      await sql`
        CREATE TABLE IF NOT EXISTS site_settings (
          key text PRIMARY KEY,
          category text NOT NULL,
          label text NOT NULL,
          value text NOT NULL DEFAULT ''
        )
      `
      await sql`
        CREATE TABLE IF NOT EXISTS content_documents (
          key text PRIMARY KEY,
          value jsonb NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE TABLE IF NOT EXISTS admin_feeds (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE TABLE IF NOT EXISTS admin_podcasts (
          id text PRIMARY KEY,
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE TABLE IF NOT EXISTS admin_podcast_episodes (
          id text PRIMARY KEY,
          podcast_id text NOT NULL REFERENCES admin_podcasts(id) ON DELETE CASCADE,
          data jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now(),
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `
      await sql`
        CREATE INDEX IF NOT EXISTS admin_podcast_episodes_podcast_idx
        ON admin_podcast_episodes (podcast_id, created_at DESC)
      `
    })().catch((error: unknown) => {
      schemaReady = undefined
      throw error
    })
  }
  await schemaReady
}
