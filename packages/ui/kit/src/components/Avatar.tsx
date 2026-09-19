import type { ComponentProps } from 'react'
import { cn } from '../lib/utils'

export function getAvatarFallback(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) {
    return '?'
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toLocaleUpperCase()
}

type AvatarProps = Omit<ComponentProps<'div'>, 'children'> & {
  src?: string | null
  alt: string
  fallback?: string
}

export function Avatar({
  alt,
  className,
  fallback = alt,
  src,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        'flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground',
        className
      )}
      {...props}
    >
      {src ? (
        <img alt={alt} className="size-full object-cover" src={src} />
      ) : (
        <span aria-hidden="true">{getAvatarFallback(fallback)}</span>
      )}
    </div>
  )
}
