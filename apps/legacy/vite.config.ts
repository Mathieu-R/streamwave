import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/style/index.scss', 'resources/ts/main.ts'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.tsx'],
    }),
  ],
})
