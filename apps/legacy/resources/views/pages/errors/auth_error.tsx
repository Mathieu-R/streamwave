import GuestLayout from '#views/layouts/guest'

interface Props {
  message: string
}

export default function AuthError(props: Props) {
  return (
    <GuestLayout>
      <div class={'container--center'}>
        <p>{props.message}</p>
      </div>
    </GuestLayout>
  )
}
