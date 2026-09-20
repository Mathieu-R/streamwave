import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from '@/lib/utils'

export const AvatarFallback = ({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) => (
  <AvatarPrimitive.Fallback
    data-slot="avatar-fallback"
    className={cn(
      'flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs',
      className
    )}
    {...props}
  />
)
