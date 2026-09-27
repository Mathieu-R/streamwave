import {
  createToaster,
  Toaster as ChakraToaster,
  Toast
} from '@chakra-ui/react'

export const toaster = createToaster({ placement: 'top-end' })

export const Toaster = () => (
  <ChakraToaster toaster={toaster}>
    {(toast) => (
      <Toast.Root>
        <Toast.Indicator />
        <Toast.Title>{toast.title}</Toast.Title>
        <Toast.CloseTrigger />
      </Toast.Root>
    )}
  </ChakraToaster>
)
