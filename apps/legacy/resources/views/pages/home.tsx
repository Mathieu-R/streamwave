import { HttpContext } from '@adonisjs/core/http'

import UserLayout from '#views/layouts/user'
import Cover from '../components/cover.js'
import { AlbumQueryResult } from '../../../app/album/repositories/album_repository.js'

interface Props {
  albums: AlbumQueryResult
}

export default function Home(props: Props) {
  const { auth } = HttpContext.getOrFail()
  const user = auth.user!

  const { albums } = props

  return (
    <UserLayout user={user}>
      <stw-library class="library">
        <section class="library__inner">
          {albums.map((album) => (
            <Cover album={album} />
          ))}
        </section>
      </stw-library>
    </UserLayout>
  )
}
