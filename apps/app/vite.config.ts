import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tanstackStart(), react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(dirname, '../../packages/ui/kit/src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        rewrite: (requestPath) => requestPath.replace(/^\/api/, '')
      }
    }
  }
})
