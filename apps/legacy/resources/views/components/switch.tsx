interface Props {
  label: string
}

export default function Switch(props: Props) {
  const { label } = props
  return (
    <div class="switch">
      <input class="switch__input" type="checkbox" name={label} />
      <label class="switch__label" for={label}>
        {label}
      </label>
    </div>
  )
}
