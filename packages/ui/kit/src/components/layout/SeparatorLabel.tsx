import { ReactNode } from 'react'
import { Separator, Text } from '@chakra-ui/react'

export const SeparatorLabel = ({ label }: { label: ReactNode }) => {
  return (
    <>
      <Separator flex="1" />
      <Text flexShrink="0" color="fg.muted" fontSize="xs">
        {label}
      </Text>
      <Separator flex="1" />
    </>
  )
}
