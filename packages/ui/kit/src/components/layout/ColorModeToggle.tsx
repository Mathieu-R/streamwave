import { IconButton } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useTheme } from 'next-themes'
import { getNextColorMode } from '../../providers/colorMode'

export const ColorModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const { formatMessage } = useIntl()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  const ariaLabel = isDark
    ? formatMessage({ id: 'Passer en mode clair' })
    : formatMessage({ id: 'Passer en mode sombre' })

  return (
    <IconButton
      aria-label={ariaLabel}
      disabled={!mounted}
      onClick={() => setTheme(getNextColorMode(resolvedTheme))}
      size="sm"
      variant="ghost"
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </IconButton>
  )
}
