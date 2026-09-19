import env from '#start/env'

export interface Props {
  album: any
}

export default function Cover(props: Props) {
  const { album } = props
  const cdnUrl = env.get('CDN_URL')
  const { id, title, artist, coverUrl, primaryColorR, primaryColorG, primaryColorB } = album
  return (
    <div class="cover">
      <a href={`/album/${id}`} class="cover__link" up-target={'.main-content'}>
        {/* cover__artwork class is useful for lazy-loading */}
        <section
          class="cover__artwork-container"
          style={{ background: `rgb(${primaryColorR} ${primaryColorG} ${primaryColorB})` }}
        >
          <img data-src={`${cdnUrl}/${coverUrl}`} alt="cover artwork" class="cover__artwork lazy" />
        </section>
        <section class="cover__infos-container">
          <div class="cover__title">{title}</div>
          <div class="cover__artist">{artist}</div>
        </section>
      </a>
    </div>
  )
}
