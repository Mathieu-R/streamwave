import { Avatar, HStack, Stack, Text } from '@chakra-ui/react'

export type User = {
  avatarUrl?: string
  fallback: string
  name: string
  email: string
}

type SideNavInfosProps = {
  user: User
}

export const SideNavInfos = ({ user }: SideNavInfosProps) => (
  <HStack p={4}>
    <Avatar.Root>
      <Avatar.Image alt={user.name} src={user.avatarUrl} />
      <Avatar.Fallback name={user.fallback} />
    </Avatar.Root>
    <Stack gap={0} minW="0">
      <Text fontSize="sm" fontWeight="medium" truncate>
        {user.name}
      </Text>
      <Text color="fg.muted" fontSize="xs" truncate>
        {user.email}
      </Text>
    </Stack>
  </HStack>
)
