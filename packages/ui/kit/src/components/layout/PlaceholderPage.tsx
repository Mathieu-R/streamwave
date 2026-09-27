import type { ReactNode } from 'react'
import { Box, Card, Container, Heading, Stack, Text } from '@chakra-ui/react'

type PlaceholderPageProps = {
  description: ReactNode
  title: ReactNode
}

export const PlaceholderPage = ({
  description,
  title
}: PlaceholderPageProps) => (
  <Container
    as="section"
    centerContent
    maxW="3xl"
    minH="calc(100dvh - 12rem)"
    py={8}
  >
    <Card.Root alignSelf="center" w="full">
      <Card.Body>
        <Stack gap={4}>
          <Text color="colorPalette.fg" fontSize="sm" fontWeight="medium">
            Streamwave
          </Text>
          <Heading as="h1" size="2xl">
            {title}
          </Heading>
          <Box color="fg.muted">{description}</Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  </Container>
)
