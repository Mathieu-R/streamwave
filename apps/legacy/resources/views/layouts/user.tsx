import { Vite } from '#start/view'

import { PropsWithChildren } from '@kitajs/html'
import NavBar from '#views/layouts/components/navbar'
import SideNav from '#views/layouts/components/side_nav'
import env from '#start/env'

type Props = PropsWithChildren<{
  user: any
}>

export default function UserLayout(props: Props) {
  const { user, children } = props
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="view-transition" content="same-origin" />

          <title>Streamwave</title>

          <Vite.Entrypoint entrypoints={['resources/style/index.scss', 'resources/ts/main.ts']} />
        </head>

        <body>
          <div class="layout layout--user">
            <NavBar user={user} />
            <div class={'flex'}>
              <SideNav user={user} />
              <div class="main-content">{children}</div>
            </div>
            <stw-player class="player" cdn={env.get('CDN_URL')} userid={user.id}></stw-player>
            <audio class="audio" preload="metadata" />
          </div>
        </body>
      </html>
    </>
  )
}
