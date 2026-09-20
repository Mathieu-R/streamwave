import type { ComponentType, ReactNode } from 'react'
import { Library } from 'lucide-react'
import { PropsWithChildren } from 'react'

export type SideNavNavigationItem = {
  // TODO: typing
  Icon: typeof Library
  label: ReactNode
  to: string
}

type LinkProps = {
  className: string
  to: string
}

type SideNavNavigationProps = {
  Link: ComponentType<PropsWithChildren<LinkProps>>
  items: SideNavNavigationItem[]
  pathname: string
}

export const SideNavNavigation = ({
  Link,
  items,
  pathname
}: SideNavNavigationProps) => {
  return (
    <nav>
      {items.map(({ Icon, label, to }) => (
        <Link
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname === to
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }`}
          key={to}
          to={to}
        >
          <Icon aria-hidden="true" className="size-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
