import { createFileRoute } from '@tanstack/react-router'
import { Music2 } from 'lucide-react'
import { FormattedMessage } from 'react-intl'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage
})

function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <section className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Music2 aria-hidden="true" className="size-6" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold">
          <FormattedMessage id="Connexion à Streamwave" />
        </h1>
        <p className="mt-3 text-muted-foreground">
          <FormattedMessage id="La connexion moderne est en cours de migration." />
        </p>
      </section>
    </main>
  )
}
