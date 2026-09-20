import { createFileRoute } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { PlaceholderPage } from '../../../../../packages/ui/kit/src/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/search')({
  component: SearchPage
})

function SearchPage() {
  return (
    <PlaceholderPage
      description={
        <FormattedMessage id="La recherche de musique sera bientôt disponible ici." />
      }
      title={<FormattedMessage id="Recherche" />}
    />
  )
}
