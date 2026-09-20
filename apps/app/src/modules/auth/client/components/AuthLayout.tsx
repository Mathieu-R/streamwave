import type { ReactNode } from 'react'
import { Music2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'

type AuthLayoutProps = {
  children: ReactNode
  description: ReactNode
  title: ReactNode
}

export function AuthLayout({ children, description, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center p-6">
        <section className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Music2 aria-hidden="true" className="size-6" />
          </div>
          <h1 className="mt-6 text-center text-2xl font-semibold">{title}</h1>
          <p className="mt-3 text-center text-muted-foreground">
            {description}
          </p>
          <div className="mt-8">{children}</div>
        </section>
      </main>
    </div>
  )
}
