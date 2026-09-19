import { formatDuration } from '#ts/helpers'

interface Props {
  index: number
  track: any
  album: string
  coverUrl: string
  type: string
}

export default function Track(props: Props) {
  const { index, track, album, coverUrl, type } = props
  return (
    <stw-track
      class={'track'}
      index={index}
      trackid={track.id}
      title={track.title}
      artist={track.artist}
      album={album}
      number={track.number}
      duration={track.duration}
      coverUrl={coverUrl}
      manifest={track.manifestUrl}
      playlist={track.playlistUrl}
      audio128={track.audio128Url}
      audio192={track.audio192Url}
      audio256={track.audio256Url}
    >
      <div class="track__number">{track.number}</div>
      <div class="track__title">{track.title}</div>
      <div class="track__duration">{formatDuration(track.duration)}</div>
      {type === 'playlist' ? <button class="track__remove"></button> : ''}
    </stw-track>
  )
}
