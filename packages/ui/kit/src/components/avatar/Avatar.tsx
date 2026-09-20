import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from '@/lib/utils'

type AvatarProps = AvatarPrimitive.Root.Props & {
  size?: 'default' | 'sm' | 'lg'
}

export const Avatar = ({
  className,
  size = 'default',
  ...props
}: AvatarProps) => (
  <AvatarPrimitive.Root
    data-size={size}
    data-slot="avatar"
    className={cn(
      'group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten',
      className
    )}
    {...props}
  />
)
