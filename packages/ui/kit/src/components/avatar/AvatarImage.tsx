import { Avatar as AvatarPrimitive } from '@base-ui/react/avatar'
import { cn } from '@/lib/utils'

export const AvatarImage = ({
  className,
  ...props
}: AvatarPrimitive.Image.Props) => (
  <AvatarPrimitive.Image
    data-slot="avatar-image"
    className={cn(
      'aspect-square size-full rounded-full object-cover',
      className
    )}
    {...props}
  />
)
