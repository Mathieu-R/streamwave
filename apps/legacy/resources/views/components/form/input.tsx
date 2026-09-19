import { Vite } from '#start/view'

interface Props {
  label: string
  type: string
  name: string
  iconUrl: string
  error?: string
}

export default function FormInput(props: Props) {
  const { label, type, name, iconUrl, error } = props
  return (
    <div class={error ? 'input-group input-group--error' : 'input-group'}>
      <label for={name}>{label}</label>
      <div class="input-group-input-wrapper">
        <Vite.Image class={'input-group__icon'} src={iconUrl} alt="icon" />
        <input class={'input-group__input'} type={type} name={name} />
      </div>
      {error && <p class={'input-group__error'}>{error}</p>}
    </div>
  )
}
