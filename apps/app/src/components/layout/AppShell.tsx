import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { AppShell as AppShellView } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { SideNav } from '@/components/layout/SideNav'
import { authClient } from '../../modules/auth/client'
import { getUserDisplay, type UserDisplayInput } from './utils/getUserDisplay'
import { SideNavNavigation } from './SideNavNavigation'

type AppShellProps = {
  children: ReactNode
  user: UserDisplayInput
}

export const AppShell = ({ children, user }: AppShellProps) => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()
  const displayUser = getUserDisplay(user)

  async function onSignOut() {
    setIsSigningOut(true)
    await authClient.signOut()
    await navigate({ to: '/sign-in' })
  }

  return (
    <AppShellView
      header={<Header isSigningOut={isSigningOut} onSignOut={onSignOut} />}
      sideNav={
        <SideNav user={displayUser} navigation={<SideNavNavigation />} />
      }
    >
      {children}
    </AppShellView>
  )
}
