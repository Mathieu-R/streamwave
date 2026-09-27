import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { TextInputBase } from './TextInput'

describe('TextInputBase', () => {
  it('forwards type and autocomplete to the input', () => {
    const markup = renderToStaticMarkup(
      <ChakraProvider value={defaultSystem}>
        <TextInputBase
          autoComplete="email"
          label="Adresse e-mail"
          onChange={() => undefined}
          type="email"
        />
      </ChakraProvider>
    )

    expect(markup).toContain('autoComplete="email"')
    expect(markup).toContain('type="email"')
  })
})
