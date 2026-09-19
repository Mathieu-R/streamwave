import { Vite } from '#start/view'
import { UserQueryResult } from '#auth/repositories/auth_repository'

interface Props {
  user: UserQueryResult
}

export default function SideNav(props: Props) {
  const { user } = props
  return (
    <aside class={'side-nav'}>
      <div class={'side-nav__user'}>
        <Vite.Image
          class={'side-nav__avatar'}
          src={'resources/assets/svg/avatar.svg'}
          alt={'avatar'}
        />
        <div class={'side-nav__user-info'}>
          <h2 class={'side-nav__fullname'}>{`${user.firstname} ${user.lastname}`}</h2>
          <p class={'side-nav__email'}>{user.email}</p>
        </div>
      </div>
      <ul class="side-nav__menu">
        <li class="side-nav__element">
          <a class="side-nav__link" href="/" up-target={'.main-content'} aria-label="library">
            <Vite.Image
              class={'side-nav__link-icon'}
              src="resources/assets/svg/library.svg"
              alt={'home'}
            />
            Library
          </a>
        </li>
        <li class="side-nav__element">
          <a
            class="side-nav__link"
            href="/playlists"
            up-target={'.main-content'}
            aria-label="playlists"
          >
            <Vite.Image
              class={'side-nav__link-icon'}
              src="resources/assets/svg/playlist.svg"
              alt={'playlists'}
            />
            Playlists
          </a>
        </li>
        <li class="side-nav__element">
          <a class="side-nav__link" href="/search" up-target={'.main-content'} aria-label="search">
            <Vite.Image
              class={'side-nav__link-icon'}
              src="resources/assets/svg/search.svg"
              alt={'search'}
            />
            Search
          </a>
        </li>
        <li class="side-nav__element">
          <a class="side-nav__link" href="/upload" up-target={'.main-content'} aria-label="upload">
            <Vite.Image
              class={'side-nav__link-icon'}
              src="resources/assets/svg/cloud_upload.svg"
              alt={'upload'}
            />
            Upload
          </a>
        </li>
        <li class="side-nav__element">
          <a
            class="side-nav__link"
            href="/settings"
            up-follow
            up-target={'.main-content'}
            aria-label="settings"
          >
            <Vite.Image
              class={'side-nav__link-icon'}
              src="resources/assets/svg/settings.svg"
              alt={'settings'}
            />
            Settings
          </a>
        </li>
      </ul>
    </aside>
  )
}
