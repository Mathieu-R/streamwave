import GuestLayout from "#views/layouts/guest";
import {csrfField, getFlashMessages} from "#start/view";
import FormInput from "#views/components/form/input";

export default function ResetPassword() {
  const flashMessages = getFlashMessages()

  return (
    <GuestLayout>
      <div class="container--center">
        <div class="form-only-wrapper">
          <form class="form">
            {csrfField()}

            <FormInput
              label={'Password'}
              name={'password'}
              type={'password'}
              iconUrl={'resources/assets/svg/lock.svg'}
              error={flashMessages.get('error')}
            />

            <FormInput
              label={'Password confirmation'}
              name={'password-confirmation'}
              type={'password-confirmation'}
              iconUrl={'resources/assets/svg/lock.svg'}
              error={flashMessages.get('error')}
            />

            <button class="form-button" aria-label="reset password">
              Reset password
            </button>
          </form>
        </div>
      </div>
    </GuestLayout>
  )
}
