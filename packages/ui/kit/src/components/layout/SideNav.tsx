import { type ReactNode } from 'react'
import { Separator } from '../separator/Separator'
import { SideNavInfos, User } from './SideNavInfos'

type SideNavProps = {
  user: User
  navigation: ReactNode
}

export const SideNav = ({ user, navigation }: SideNavProps) => {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <SideNavInfos user={user} />
      <Separator className="bg-sidebar-border" />
      <div className="p-2">{navigation}</div>
    </aside>
  )
}
