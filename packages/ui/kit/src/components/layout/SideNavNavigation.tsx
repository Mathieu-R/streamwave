import type { ComponentType, ReactNode } from 'react'
import { HStack, Link as ChakraLink } from '@chakra-ui/react'
import { Library } from 'lucide-react'
import { PropsWithChildren } from 'react'

export type SideNavNavigationItem = {
  // TODO: typing
  Icon: typeof Library
  label: ReactNode
  to: string
}

type LinkProps = {
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
        <ChakraLink
          _hover={{ bg: 'bg.muted' }}
          asChild
          borderRadius="md"
          bg={pathname === to ? 'bg.emphasized' : undefined}
          display="block"
          key={to}
        >
          <Link to={to}>
            <HStack gap={3} px={3} py={2.5}>
              <Icon aria-hidden="true" />
              {label}
            </HStack>
          </Link>
        </ChakraLink>
      ))}
    </nav>
  )
}
