import { LogOut, Music2 } from 'lucide-react'
import { Button } from '@/components/button/Button'
import { FormattedMessage, useIntl } from 'react-intl'

type HeaderProps = {
  isSigningOut?: boolean
  onSignOut?: () => Promise<void>
}

export const Header = ({ isSigningOut, onSignOut }: HeaderProps) => {
  const intl = useIntl()
  return (
    <header className="flex h-16 items-center justify-between border-b bg-sidebar px-5 text-sidebar-foreground">
      <h2 className="flex items-center gap-2 text-lg font-medium">
        <Music2 aria-hidden="true" className="size-5" />
        <span>Streamwave</span>
      </h2>
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
    </header>
  )
}
