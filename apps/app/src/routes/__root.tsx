import type { ReactNode } from 'react'
import { messages } from '@streamwave/translations'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts
} from '@tanstack/react-router'
import { IntlProvider } from 'react-intl'
import { UiProvider } from '@/providers/UiProvider'
import globalStylesheet from '../index.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        title: 'Streamwave'
      }
    ],
    links: [{ rel: 'stylesheet', href: globalStylesheet }]
  }),
  component: RootComponent
})

function RootComponent() {
  // TODO: get locale from user settings
  return (
    <UiProvider>
      <IntlProvider locale="fr" defaultLocale="fr" messages={messages.fr}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </IntlProvider>
    </UiProvider>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
