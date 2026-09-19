import { Vite } from '#start/view'

import { Children } from '@kitajs/html'
import NavBar from '#views/layouts/components/navbar'

type Props = {
  children: Children
}

export default function GuestLayout({ children }: Props) {
  return (
    <>
      {'<!DOCTYPE html>'}
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="view-transition" content="same-origin" />

          <title>Streamwave</title>

          <Vite.Entrypoint entrypoints={['resources/style/index.scss']} />
        </head>

        <body>
          <div class="layout layout--guest">
            <NavBar />
            {children}
          </div>
        </body>
      </html>
    </>
  )
}
