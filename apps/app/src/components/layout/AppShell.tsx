import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import {
  Library,
  ListMusic,
  LogOut,
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
  AvatarFallback,
  AvatarImage
} from '@streamwave/ui-kit/components/avatar'
import { Button } from '@streamwave/ui-kit/components/button'
import { Separator } from '@streamwave/ui-kit/components/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@streamwave/ui-kit/components/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@streamwave/ui-kit/components/tooltip'
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

function Navigation() {
  const { pathname } = useLocation()

  return (
    <SidebarMenu>
      {navigationItems.map(({ icon: Icon, label, to }) => (
        <SidebarMenuItem key={to}>
          <SidebarMenuButton
            isActive={pathname === to}
            render={<Link to={to} />}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function AppShell({ children, user }: AppShellProps) {
  const { formatMessage } = useIntl()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()
  const displayUser = getUserDisplay(user)

  async function handleSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    await navigate({ to: '/sign-in' })
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/" />} size="lg">
                  <span className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                    <Music2 aria-hidden="true" className="size-4" />
                  </span>
                  <span className="font-semibold">Streamwave</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <Separator className="bg-sidebar-border" />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <Navigation />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="bg-sidebar-border" />
            <div className="flex items-center gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
              <Avatar>
                <AvatarImage
                  alt={displayUser.name}
                  src={displayUser.avatarUrl ?? undefined}
                />
                <AvatarFallback>
                  {displayUser.fallback.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">
                  {displayUser.name}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {user.email}
                </p>
              </div>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      aria-label={formatMessage({ id: 'Déconnexion' })}
                      disabled={isSigningOut}
                      onClick={handleSignOut}
                      size="icon-sm"
                      variant="ghost"
                    />
                  }
                >
                  <LogOut aria-hidden="true" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <FormattedMessage id="Déconnexion" />
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur">
            <SidebarTrigger
              aria-label={formatMessage({ id: 'Ouvrir la navigation' })}
              className="md:hidden"
            />
            <p className="text-sm text-muted-foreground">
              <FormattedMessage id="Votre musique, partout." />
            </p>
          </header>
          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
