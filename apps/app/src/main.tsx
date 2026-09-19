import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import { RouterProvider } from '@tanstack/react-router'
import { messages } from '@streamwave/translations'
import { router } from './router'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root is missing')
}

createRoot(rootElement).render(
  <StrictMode>
    <IntlProvider locale="fr" defaultLocale="fr" messages={messages.fr}>
      <RouterProvider router={router} />
    </IntlProvider>
  </StrictMode>
)
