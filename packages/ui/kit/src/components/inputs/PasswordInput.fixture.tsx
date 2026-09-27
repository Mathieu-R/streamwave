import { useState } from 'react'
import { PasswordInputBase } from './PasswordInput'

const PasswordInputFixture = () => {
  const [value, setValue] = useState('Soleil!2026')

  return (
    <PasswordInputBase
      error="Le mot de passe doit contenir au moins 8 caractères."
      label="Mot de passe"
      onChange={(event) => setValue(event.currentTarget.value)}
      showStrengthMeter
      value={value}
    />
  )
}

export default PasswordInputFixture
