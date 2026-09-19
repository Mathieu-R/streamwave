import { createFileRoute } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { PlaceholderPage } from '../../components/layout/PlaceholderPage'

export const Route = createFileRoute('/_authenticated/playlists')({
  component: PlaylistsPage
})

function PlaylistsPage() {
  return (
    <PlaceholderPage
      description={
        <FormattedMessage id="Vos playlists migreront dans cet espace." />
      }
      title={<FormattedMessage id="Playlists" />}
    />
  )
}
