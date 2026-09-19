import { defineConfig } from 'vite'
import honoDevServer from '@hono/vite-dev-server'

export default defineConfig({
  plugins: [
    honoDevServer({
      entry: './src/index.ts'
    })
  ],
  server: {
    port: 4000
  }
})
