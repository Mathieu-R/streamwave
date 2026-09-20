import { Avatar } from '../avatar/Avatar'
import { AvatarFallback } from '../avatar/AvatarFallback'
import { AvatarImage } from '../avatar/AvatarImage'

export type User = {
  avatarUrl?: string
  fallback: string
  name: string
  email: string
}

type SideNavInfosProps = {
  user: User
}

export const SideNavInfos = ({ user }: SideNavInfosProps) => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage alt={user.name} src={user.avatarUrl ?? undefined} />
          <AvatarFallback>
            {user.fallback.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-sidebar-foreground/70">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  )
}
