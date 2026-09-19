import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import './stw_slider.js'

@customElement('stw-volume')
export default class STWVolume extends LitElement {
  static styles = css`
    :host {
      flex: 1;
      padding: 0 10px;
    }

    .wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
    }

    .volume__button {
      background: none;
      border: none;
      cursor: pointer;
    }
  `

  constructor() {
    super()
  }

  get _audio() {
    return document.querySelector<HTMLAudioElement>('audio')!
  }

  onSeek(evt: CustomEvent) {
    this._audio.volume = evt.detail.position
  }

  toggleVolume() {
    console.log('toggle volume')
  }

  render() {
    return html`
      <div class="wrapper">
        <button class="volume__button" @click="${this.toggleVolume}">
          <img class="volume__icon" src="/resources/assets/svg/volume_max.svg" alt="volume" />
        </button>
        <stw-slider class="volume__slider" @seek=${this.onSeek} defaultvalue="1"></stw-slider>
      </div>
    `
  }
}
