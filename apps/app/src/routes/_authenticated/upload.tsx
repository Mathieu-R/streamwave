import { createFileRoute } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { PlaceholderPage } from '../../../../../packages/ui/kit/src/components/layout/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/upload')({
  component: UploadPage
})

function UploadPage() {
  return (
    <PlaceholderPage
      description={
        <FormattedMessage id="L’import de votre musique sera bientôt disponible ici." />
      }
      title={<FormattedMessage id="Importer" />}
    />
  )
}
