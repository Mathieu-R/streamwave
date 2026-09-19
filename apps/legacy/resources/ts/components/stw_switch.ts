import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('stw-switch')
export default class STWSwitch extends LitElement {
  static styles = css`
    :host {
      width: 100%;
    }

    .switch__input {
      position: absolute;
      opacity: 0;
    }

    .switch__input:checked ~ .switch__label::before {
      opacity: 1;
    }

    .switch__input:checked ~ .switch__label::after {
      transform: translate(0, -50%);
    }

    .switch__label {
      position: relative;
      display: flex;
      padding: 5px 75px 5px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .switch__label::before {
      content: '';
      display: block;
      position: absolute;
      width: 50px;
      height: 20px;
      border-radius: 10px;
      background: #1870d7;
      transition: opacity 0.3s cubic-bezier(0, 0, 0.3, 1);
      top: 50%;
      right: 5px;
      opacity: 0.5;
      transform: translateY(-50%);
    }

    .switch__label::after {
      content: '';
      display: block;
      position: absolute;
      height: 24px;
      width: 24px;
      top: 50%;
      right: 5px;
      transform: translate(-25px, -50%);
      border-radius: 50%;
      background: #fff;
      transition: transform 0.3s cubic-bezier(0, 0, 0.3, 1);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    }
  `

  @property({ type: String })
  label = ''

  @property({ type: Boolean })
  checked = false

  constructor() {
    super()
  }

  onChange(evt: Event) {
    this.dispatchEvent(new CustomEvent('change', { detail: { value: evt.target.checked } }))
  }

  render() {
    return html`
      <input
        class="switch__input"
        type="checkbox"
        id=${this.label}
        @change="${this.onChange}"
        ?checked="${!this.checked}"
      />
      <label class="switch__label" for="${this.label}">${this.label}</label>
    `
  }
}
