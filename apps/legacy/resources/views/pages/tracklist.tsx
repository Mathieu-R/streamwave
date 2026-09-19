import { pluralize } from '#ts/helpers'
import { AlbumQueryResult } from '../../../app/album/repositories/album_repository.js'

import Switch from '#views/components/switch'
import Track from '#views/components/track'
import UserLayout from '#views/layouts/user'
import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'

interface Props {
  album: AlbumQueryResult
  type: string
}

export default function TrackListPage(props: Props) {
  const { auth } = HttpContext.getOrFail()
  const cdnUrl = env.get('CDN_URL')
  const user = auth.user!

  const { album, type } = props
  return (
    <UserLayout user={user}>
      <stw-tracklist class="tracklist" tracklistid={`${type}-${album.id}`}>
        <section class="tracklist__infos">
          <div class="tracklist__infos-wrapper">
            {album.coverUrl && (
              <img class="tracklist__cover" alt="cover" src={`${cdnUrl}/${album.coverUrl}`} />
            )}
            <div class="tracklist__details">
              <div class="tracklist__title">{album.title}</div>
              <div class="tracklist__artist">{album.artist}</div>
              <div class="tracklist__line">
                <span class="tracklist__year">
                  {album.year ? album.year : 'unknown year of publication'}
                </span>
                •
                <span class="tracklist__tracks-counter">
                  {album.tracks.length} {pluralize('title', album.tracks.length)}
                </span>
                •
                <span class="tracklist__genre">
                  {type === 'playlist' ? 'playlist' : album.genre ? album.genre : 'unknown'}
                </span>
              </div>
            </div>
          </div>
          <div class="tracklist__download">
            <stw-download-switch class="tracklist__toggle-container">
              <Switch label="Download" />
            </stw-download-switch>
          </div>
        </section>
        <section class="tracklist__tracks">
          {album.tracks.map((track, idx) => (
            <Track
              index={idx}
              track={track}
              album={album.title}
              coverUrl={album.coverUrl}
              type={type}
            />
          ))}
        </section>
      </stw-tracklist>
    </UserLayout>
  )
}
