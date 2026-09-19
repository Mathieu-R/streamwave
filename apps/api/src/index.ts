import { Hono } from 'hono/quick'
import { devServer } from '@streamwave/hono'

const app = new Hono()

devServer(app)

app.get('/health', (c) => c.json({ ok: true }))

export default app
