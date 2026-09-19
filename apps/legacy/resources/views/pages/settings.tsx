import UserLayout from '#views/layouts/user'
import { HttpContext } from '@adonisjs/core/http'

export default function Settings() {
  const { auth } = HttpContext.getOrFail()
  const user = auth.user!

  return (
    <UserLayout user={user}>
      <div class="settings">
        <stw-settings class="settings__container">
          <div class="settings__buttons">
            <button class="settings__button" aria-label="clear cache">
              Clear cache
            </button>
            <button class="settings__button" aria-label="restore settings">
              Restore settings
            </button>
          </div>
        </stw-settings>
      </div>
    </UserLayout>
  )
}
