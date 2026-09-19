import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from '@streamwave/ui-kit/components/button'

export const HomePage = () => {
  const [status, _setStatus] = useState<string>('ok')

  return (
    <main>
      <p>
        <FormattedMessage
          id="API : {status}"
          defaultMessage="API : {status}"
          values={{ status }}
        />
      </p>
      <Button>
        <FormattedMessage id="Bouton" />
      </Button>
    </main>
  )
}
