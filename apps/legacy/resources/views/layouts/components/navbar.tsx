import { csrfField, route } from '#start/view'

interface Props {
  title?: string
  user?: any
}

export default function NavBar(props: Props) {
  const { title = 'Streamwave', user } = props
  return (
    <header class="navbar">
      <h2 class="navbar__title">{title}</h2>
      {user && (
        <form method={'POST'} action={route('auth.logout')}>
          {csrfField()}
          <button class={'btn btn--third'} type="submit">
            Logout
          </button>
        </form>
      )}
    </header>
  )
}
