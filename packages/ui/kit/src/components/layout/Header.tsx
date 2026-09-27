import { Flex, Heading, HStack, Button } from '@chakra-ui/react'
import { LogOut, Music2 } from 'lucide-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ColorModeToggle } from './ColorModeToggle'

type HeaderProps = {
  isSigningOut?: boolean
  onSignOut?: () => Promise<void>
}

export const Header = ({ isSigningOut, onSignOut }: HeaderProps) => {
  const intl = useIntl()
  return (
    <Flex
      as="header"
      borderBottomWidth="1px"
      justify="space-between"
      minH="16"
      px={5}
      py={3}
    >
      <Heading alignItems="center" as="h2" display="flex" fontSize="lg" gap={2}>
        <Music2 aria-hidden="true" />
        Streamwave
      </Heading>
      <HStack gap={2}>
        <ColorModeToggle />
        {onSignOut && (
          <Button
            aria-label={intl.formatMessage({ id: 'Déconnexion' })}
            disabled={isSigningOut}
            onClick={onSignOut}
            size="sm"
            variant="ghost"
          >
            <LogOut aria-hidden="true" />
            <span>
              <FormattedMessage id="Déconnexion" />
            </span>
          </Button>
        )}
      </HStack>
    </Flex>
  )
}
