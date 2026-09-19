import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'

@customElement('stw-select')
export default class STWSelect extends LitElement {
  static styles = css`
    :host {
      position: relative;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      --custom-arow-width: 30px;
    }

    select {
      padding: 10px 30px 10px 20px;
      font-size: 16px;
      background: var(--color-surface-300);
      color: #fff;
      border: 0;
    }

    .custom-arrow {
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      height: 100%;
      width: var(--custom-arow-width);
      background: var(--color-surface-200);
      pointer-events: none;
    }

    .custom-arrow::before,
    .custom-arrow::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      --size: 5px;
    }

    .custom-arrow::before {
      border-left: var(--size) solid transparent;
      border-right: var(--size) solid transparent;
      border-bottom: var(--size) solid #fff;

      top: 40%;
    }

    .custom-arrow::after {
      border-left: var(--size) solid transparent;
      border-right: var(--size) solid transparent;
      border-top: var(--size) solid #fff;

      top: 60%;
    }
  `

  onChange(evt: Event) {
    const target = evt.target as HTMLSelectElement
    this.dispatchEvent(new CustomEvent('change', { detail: { value: target.value } }))
  }

  render() {
    return html`
      <select @change="${this.onChange}">
        <option value="128">128k</option>
        <option value="192">192k</option>
        <option value="256">256k</option>
      </select>
      <span class="custom-arrow"></span>
    `
  }
}
