import { createFileRoute } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { PlaceholderPage } from '../../components/layout/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/')({
  component: LibraryPage
})

function LibraryPage() {
  return (
    <PlaceholderPage
      description={
        <FormattedMessage id="Votre bibliothèque musicale sera bientôt disponible ici." />
      }
      title={<FormattedMessage id="Bibliothèque" />}
    />
  )
}
