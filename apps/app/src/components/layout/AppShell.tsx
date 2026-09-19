import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  Library,
  ListMusic,
  LogOut,
  Menu,
  Music2,
  Search,
  Settings,
  Upload
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Avatar,
  Button,
  cn,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger
} from '@streamwave/ui-kit'
import { authClient } from '../../modules/auth/client'
import { getUserDisplay, type UserDisplayInput } from './userDisplay'

type AppShellProps = {
  children: ReactNode
  user: UserDisplayInput
}

type NavigationItem = {
  icon: typeof Library
  label: ReactNode
  to: '/' | '/playlists' | '/search' | '/upload' | '/settings'
}

const navigationItems: NavigationItem[] = [
  { icon: Library, label: <FormattedMessage id="Bibliothèque" />, to: '/' },
  {
    icon: ListMusic,
    label: <FormattedMessage id="Playlists" />,
    to: '/playlists'
  },
  { icon: Search, label: <FormattedMessage id="Recherche" />, to: '/search' },
  { icon: Upload, label: <FormattedMessage id="Importer" />, to: '/upload' },
  {
    icon: Settings,
    label: <FormattedMessage id="Paramètres" />,
    to: '/settings'
  }
]

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { formatMessage } = useIntl()
  const { pathname } = useLocation()

  return (
    <nav
      aria-label={formatMessage({ id: 'Navigation principale' })}
      className="space-y-1"
    >
      {navigationItems.map(({ icon: Icon, label, to }) => {
        const isActive = pathname === to

        return (
          <Link
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              isActive &&
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
            )}
            key={to}
            onClick={onNavigate}
            to={to}
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AppShell({ children, user }: AppShellProps) {
  const { formatMessage } = useIntl()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const navigate = useNavigate()
  const displayUser = getUserDisplay(user)

  async function handleSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    await navigate({ to: '/sign-in' })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-card/90 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <Sheet onOpenChange={setIsNavigationOpen} open={isNavigationOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label={formatMessage({ id: 'Ouvrir la navigation' })}
                className="md:hidden"
                size="icon"
                variant="ghost"
              >
                <Menu aria-hidden="true" className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Music2 aria-hidden="true" className="size-5" />
                </div>
                <div>
                  <SheetTitle>Streamwave</SheetTitle>
                  <SheetDescription>
                    <FormattedMessage id="Votre musique, partout." />
                  </SheetDescription>
                </div>
              </div>
              <SheetClose asChild>
                <div>
                  <Navigation onNavigate={() => setIsNavigationOpen(false)} />
                </div>
              </SheetClose>
            </SheetContent>
          </Sheet>
          <Link
            className="flex items-center gap-2 font-semibold tracking-tight"
            to="/"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Music2 aria-hidden="true" className="size-4" />
            </span>
            <span>Streamwave</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{displayUser.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Avatar
            alt={displayUser.name}
            fallback={displayUser.fallback}
            src={displayUser.avatarUrl}
          />
          <Button
            disabled={isSigningOut}
            onClick={handleSignOut}
            size="sm"
            variant="ghost"
          >
            <LogOut aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">
              <FormattedMessage id="Déconnexion" />
            </span>
          </Button>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-2xl">
        <aside className="hidden w-64 shrink-0 border-r bg-card/50 p-4 md:block">
          <Navigation />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
