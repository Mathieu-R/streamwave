import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import Constants from '#ts/constants'
import './stw_switch'
import './stw_select'
import './stw_storage'

@customElement('stw-settings')
export default class STWSettings extends LitElement {
  static styles = css`
    .notifications__description {
      margin: 5px 0;
      font-size: 12px;
    }

    .download-quality {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 50px;
    }
  `

  constructor() {
    super()
  }

  onToggleNotifications(evt: CustomEvent) {
    console.log(evt)
  }

  onDownloadQualityChange(evt: CustomEvent) {
    console.log(evt.detail.value)
  }

  render() {
    return html`
      ${Constants.SUPPORT_PUSH_NOTIFICATIONS
        ? html` <div class="notifications">
            <stw-switch
              label="Allow notifications"
              checked="true"
              @change="${this.onToggleNotifications}"
            ></stw-switch>
            <p class="notifications__description">
              Example: you will receive notifications when a new album is added.
            </p>
          </div>`
        : ''}

      <div class="download-quality">
        <label for="quality">Download quality</label>
        <stw-select value="128" @change="${this.onDownloadQualityChange}"></stw-select>
      </div>

      ${Constants.SUPPORT_STORAGE_API ? html` <stw-storage></stw-storage>` : ''}

      <slot></slot>
    `
  }
}
