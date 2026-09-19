import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      include: ['**/*.test.ts', '**/*.test.tsx'],
      exclude: ['**/*.db.test.ts', '**/node_modules/**']
    }
  },
  {
    test: {
      name: 'db',
      include: ['**/*.db.test.ts'],
      exclude: ['**/node_modules/**']
    }
  }
])
