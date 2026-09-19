import { customElement, state } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'

@customElement('stw-storage')
export default class STWStorage extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
      margin-bottom: 10px;
    }

    .storage__description {
      margin: 5px 0;
      font-size: 12px;
    }

    .storage__container {
      position: relative;
      height: 15px;
      width: 100%;
      background: rgba(255, 255, 255, 0.5);
      margin: 5px 0 10px 0;
    }

    .storage__used {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      transform: scaleX(0);
      transform-origin: 0 50%;
      transition: transform 0.2s cubic-bezier(0, 0, 0.3, 1);
    }

    .storage__infos {
      display: flex;
    }

    .storage__used-info,
    .storage__quota-info {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      font-weight: 400;
      margin-right: 5px;
    }

    .storage__used-info::before,
    .storage__quota-info::before {
      content: '';
      width: 10px;
      height: 10px;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 5px;
    }

    .storage__used-info::before {
      background: #fff;
    }

    .storage__quota-info::before {
      background: rgba(255, 255, 255, 0.5);
    }
  `

  @state()
  usage = 0

  @state()
  quota = 0

  connectedCallback() {
    super.connectedCallback()

    this.getStorage().catch((err: Error) => {
      console.warn('[STORAGE] cannot retrieve storage infos')
      console.error(err)
    })
  }

  async getStorage() {
    const { quota, usage } = await navigator.storage.estimate()

    if (quota) {
      this.quota = Math.round(quota / (1000 * 1024))
    }

    if (usage) {
      this.usage = Math.round(usage / (1000 * 1024))
    }
  }

  renderAvailableStorage(quota: number) {
    return quota >= 1000 ? html`${quota / 1000}gb` : html`${quota}mb`
  }

  render() {
    return html`
      <div class="storage__title">Available storage</div>
      <p class="storage__description">
        Available storage can vary according to different implementations
      </p>
      <section class="storage__container">
        <div class="storage__used" style="transform: scaleX(${this.usage / this.quota})" />
      </section>
      <section class="storage__infos">
        <div class="storage__used-info">Used • ${this.usage}mb</div>
        <div class="storage__quota-info">
          Available • ${this.renderAvailableStorage(this.quota)}
        </div>
      </section>
    `
  }
}
