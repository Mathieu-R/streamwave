import type { ReactNode } from 'react'
import { Box, Card, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { Music2 } from 'lucide-react'
import { Header } from '../layout/Header'

type AuthenticationLayoutProps = {
  children: ReactNode
  description: ReactNode
  title: ReactNode
}

export const AuthenticationLayout = ({
  children,
  description,
  title
}: AuthenticationLayoutProps) => (
  <Box minH="dvh">
    <Header />
    <Center minH="calc(100dvh - 4rem)" p={6}>
      <Card.Root maxW="md" w="full">
        <Card.Body>
          <Stack gap={6}>
            <Center
              bg="colorPalette.solid"
              boxSize="12"
              color="colorPalette.contrast"
              rounded="lg"
            >
              <Music2 aria-hidden="true" />
            </Center>
            <Stack gap={3} textAlign="center">
              <Heading as="h1" size="lg">
                {title}
              </Heading>
              <Text color="fg.muted">{description}</Text>
            </Stack>
            {children}
          </Stack>
        </Card.Body>
      </Card.Root>
    </Center>
  </Box>
)
