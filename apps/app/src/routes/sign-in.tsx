import { createFileRoute } from '@tanstack/react-router'
import { Music2 } from 'lucide-react'
import { FormattedMessage } from 'react-intl'
import { Header } from '../../../../packages/ui/kit/src/components/layout/Header'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage
})

function SignInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center p-6">
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
    </div>
  )
}
