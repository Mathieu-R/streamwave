import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from '@/components/Button'

type HealthResponse = {
  ok: boolean
}

export const HomePage = () => {
  const [healthOk, setHealthOk] = useState<boolean | null>(null)

  useEffect(() => {
    const loadHealth = async () => {
      const response = await fetch('/api/health')
      const data: HealthResponse = await response.json()
      setHealthOk(data.ok)
    }

    void loadHealth()
  }, [])

  const status =
    healthOk === null ? '…' : healthOk ? 'ok' : 'indisponible'

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
