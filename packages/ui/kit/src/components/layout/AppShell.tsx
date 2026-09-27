import type { PropsWithChildren, ReactNode } from 'react'
import { Box, Flex } from '@chakra-ui/react'

type AppShellProps = PropsWithChildren<{
  header: ReactNode
  sideNav: ReactNode
}>

export const AppShell = ({ header, sideNav, children }: AppShellProps) => (
  <Box minH="dvh">
    {header}
    <Flex minH="calc(100dvh - 4rem)">
      {sideNav}
      <Box flex="1" minW="0" p={{ base: 4, md: 6, lg: 8 }}>
        {children}
      </Box>
    </Flex>
  </Box>
)
