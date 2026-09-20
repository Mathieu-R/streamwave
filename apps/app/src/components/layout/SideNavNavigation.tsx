import { useLocation, Link } from '@tanstack/react-router'
import { FormattedMessage } from 'react-intl'
import { Library, ListMusic, Search, Settings, Upload } from 'lucide-react'
import {
  SideNavNavigationItem,
  SideNavNavigation as SideNavNavigationView
} from '@/components/layout/SideNavNavigation'

const navigationItems: SideNavNavigationItem[] = [
  { Icon: Library, label: <FormattedMessage id="Bibliothèque" />, to: '/' },
  {
    Icon: ListMusic,
    label: <FormattedMessage id="Playlists" />,
    to: '/playlists'
  },
  { Icon: Search, label: <FormattedMessage id="Recherche" />, to: '/search' },
  { Icon: Upload, label: <FormattedMessage id="Importer" />, to: '/upload' },
  {
    Icon: Settings,
    label: <FormattedMessage id="Paramètres" />,
    to: '/settings'
  }
]

export const SideNavNavigation = () => {
  const { pathname } = useLocation()

  return (
    <SideNavNavigationView
      Link={Link}
      items={navigationItems}
      pathname={pathname}
    />
  )
}
