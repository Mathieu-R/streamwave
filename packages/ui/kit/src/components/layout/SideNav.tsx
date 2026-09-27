import { type ReactNode } from 'react'
import { Box, Separator, Stack } from '@chakra-ui/react'
import { SideNavInfos, User } from './SideNavInfos'

type SideNavProps = {
  user: User
  navigation: ReactNode
}

export const SideNav = ({ user, navigation }: SideNavProps) => (
  <Stack as="aside" borderRightWidth="1px" flexShrink="0" gap={0} w="64">
    <SideNavInfos user={user} />
    <Separator />
    <Box p={2}>{navigation}</Box>
  </Stack>
)
