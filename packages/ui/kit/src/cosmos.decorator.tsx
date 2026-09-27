import type { DecoratorProps } from 'react-cosmos/client'
import { IntlProvider } from 'react-intl'
import { UiProvider } from './providers/UiProvider'

const CosmosDecorator = ({ children }: DecoratorProps) => {
  return (
    <UiProvider>
      <IntlProvider locale="fr">{children}</IntlProvider>
    </UiProvider>
  )
}

export default CosmosDecorator
