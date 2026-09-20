import type { PropsWithChildren, ReactNode } from 'react'

type AppShellProps = PropsWithChildren<{
  header: ReactNode
  sideNav: ReactNode
}>

export const AppShell = ({ header, sideNav, children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      {header}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {sideNav}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
