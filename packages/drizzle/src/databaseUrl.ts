export function getDatabaseUrl(): string {
  const user = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD
  const database = process.env.POSTGRES_DB
  const host = process.env.POSTGRES_HOST ?? 'localhost'
  const port = process.env.POSTGRES_PORT ?? '5432'

  if (!user || !password || !database) {
    throw new Error('Missing POSTGRES_USER, POSTGRES_PASSWORD or POSTGRES_DB')
  }

  const encodedUser = encodeURIComponent(user)
  const encodedPassword = encodeURIComponent(password)
  return `postgres://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`
}
