import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cn } from '@/lib/utils'

type SeparatorProps = Omit<SeparatorPrimitive.Props, 'orientation'>

export const Separator = ({ className, ...props }: SeparatorProps) => (
  <SeparatorPrimitive
    data-slot="separator"
    className={cn('h-px w-full shrink-0 bg-border', className)}
    {...props}
  />
)
