import { createFileRoute } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { PlaceholderPage } from '../../components/layout/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage
})

function SettingsPage() {
  return (
    <PlaceholderPage
      description={
        <FormattedMessage id="Vos préférences Streamwave migreront dans cet espace." />
      }
      title={<FormattedMessage id="Paramètres" />}
    />
  )
}
