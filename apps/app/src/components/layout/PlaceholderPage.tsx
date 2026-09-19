import type { ReactNode } from 'react'

type PlaceholderPageProps = {
  description: ReactNode
  title: ReactNode
}

export function PlaceholderPage({ description, title }: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center justify-center">
      <div className="w-full rounded-xl border bg-card p-8 shadow-sm sm:p-12">
        <p className="mb-3 text-sm font-medium text-primary">Streamwave</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}
