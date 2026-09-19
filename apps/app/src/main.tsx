import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root is missing')
}

createRoot(rootElement).render(
  <StrictMode>
    <IntlProvider locale="fr" defaultLocale="fr" messages={{}}>
      <RouterProvider router={router} />
    </IntlProvider>
  </StrictMode>
)
