import GuestLayout from '#views/layouts/guest'
import { csrfField, getFlashMessages } from '#start/view'
import FormInput from '#views/components/form/input'

export default function ForgotPassword() {
  const flashMessages = getFlashMessages()

  return (
    <GuestLayout>
      <div class="container--center">
        <div class="form-only-wrapper">
          <form class="form">
            {csrfField()}

            <FormInput
              label={'Email'}
              name={'email'}
              type={'email'}
              iconUrl={'resources/assets/svg/mail.svg'}
              error={flashMessages.get('error')}
            />

            <button
              class="btn btn--primary"
              type={'submit'}
              aria-label="send email to change password"
            >
              Send password reset email
            </button>
          </form>
        </div>
      </div>
    </GuestLayout>
  )
}
