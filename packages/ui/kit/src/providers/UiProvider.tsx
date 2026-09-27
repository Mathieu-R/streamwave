import type { PropsWithChildren } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '../components/toast/Toaster'
import { colorModeStorageKey } from './colorMode'

export const UiProvider = ({ children }: PropsWithChildren) => (
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
      storageKey={colorModeStorageKey}
    >
      {children}
      <Toaster />
    </ThemeProvider>
  </ChakraProvider>
)
