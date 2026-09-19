import { css, html, LitElement } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import player from '../store/player/signals.js'
import { SignalWatcher } from '@lit-labs/preact-signals'
import { formatDuration } from '#ts/helpers'

@customElement('stw-progress')
export default class STWTrackbar extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      --progress-bar-height: 5px;
    }

    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      height: 100%;
    }

    .player__current_time,
    .player__total_time {
      width: 30px;
      font-size: 12px;
    }

    .progress-bar {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      border-radius: 5px;
    }

    .progress-bar--disabled {
      opacity: 0;
    }

    .progress-bar__track {
      position: absolute;
      top: 50%;
      left: 50%;
      height: var(--progress-bar-height);
      width: 100%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.5);
    }

    .progress-bar__track-used {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: var(--progress-bar-height);
      background: #fff;
      border-radius: 5px;
      transform: translate(-50%, -50%) scale(0);
      transform-origin: 0 50%;
      will-change: transform;
    }

    .progress-bar__seeker-container {
      position: relative;
      width: 100%;
      background: 0 0;
      border: none;
      outline: none;
      pointer-events: none;
    }

    .progress-bar__seeker {
      position: absolute;
      top: 50%;
      left: -5px;
      height: 20px;
      width: 20px;
      outline: 0;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
      transform: translateY(-50%) scale(0.9);
      transition: transform 0.2s cubic-bezier(0, 0, 0.3, 1);
      will-change: transform;
    }

    .progress-bar__seeker--active {
      box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1);
    }
  `

  private bcr: null | DOMRect
  private dragging: boolean

  @property({ type: Boolean })
  active = false

  @property({ type: Number })
  position = null

  constructor() {
    super()

    this.bcr = null
    this.dragging = false

    this.onResize = this.onResize.bind(this)
    this.updatePosition = this.updatePosition.bind(this)
    this.onSwipeStart = this.onSwipeStart.bind(this)
    this.onSwipeMove = this.onSwipeMove.bind(this)
    this.onSwipeEnd = this.onSwipeEnd.bind(this)
  }

  // reference to the progress bar element
  // because we need to know its BCR properties
  // strangely @query doesn't work
  get _progressBar() {
    return this.renderRoot?.querySelector<HTMLElement>('.progress-bar') ?? null
  }

  get _trackUsed() {
    return this.renderRoot?.querySelector<HTMLElement>('.progress-bar__track-used') ?? null
  }

  get _seekerContainer() {
    return this.renderRoot?.querySelector<HTMLElement>('.progress-bar__seeker-container') ?? null
  }

  get _seeker() {
    return this.renderRoot?.querySelector<HTMLElement>('.progress-bar__seeker') ?? null
  }

  connectedCallback() {
    super.connectedCallback()

    document.addEventListener('touchmove', this.onSwipeMove, { passive: true })
    document.addEventListener('touchend', this.onSwipeEnd, { passive: true })
    document.addEventListener('mousemove', this.onSwipeMove, { passive: true })
    document.addEventListener('mouseup', this.onSwipeEnd, { passive: true })
    window.addEventListener('resize', this.onResize)
  }

  updated(changedProperties) {
    console.log(changedProperties)
    player.currentTime.subscribe((currentTime) => {
      // shadow dom not rendered yet
      if (!this._trackUsed) {
        return
      }

      // avoid audio element updating the UI if we are dragging the seeker
      // while we are listening to a track
      if (this.dragging) {
        return
      }

      this.currentTimeFormatted = formatDuration(currentTime)

      const positionX = currentTime / this._audio.duration
      this.updateUI(positionX)
    })
  }

  firstUpdated() {
    this.onResize()
  }

  onResize() {
    this.bcr = this._progressBar!.getBoundingClientRect()
  }

  findCandidate(evt: TouchEvent | MouseEvent) {
    if (evt.touches && evt.touches.length) {
      return evt.touches[0]
    }

    if (evt.changedTouches && evt.changedTouches.length) {
      return evt.changedTouches[0]
    }

    return evt
  }

  onSwipeStart(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    if (!this.active) {
      return
    }

    // focus on seeker element
    this._seekerContainer!.focus()
    this.dragging = true
    this._seeker!.classList.add('progress-bar__seeker--active')
  }

  onSwipeMove(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    if (!this.dragging) {
      return
    }

    this.updatePosition(evt)
  }

  onSwipeEnd(evt: TouchEvent | MouseEvent) {
    evt.stopPropagation()

    if (!this.dragging) {
      return
    }

    this.dragging = false
    this._seeker!.classList.remove('progress-bar__seeker--active')

    const clampedPositionX = this.updatePosition(evt)

    // send event
    this.dispatchEvent(new CustomEvent('seeked', { detail: clampedPositionX }))
  }

  updatePosition(evt: TouchEvent | MouseEvent) {
    if (!this.bcr) {
      return
    }

    const positionX = this.findCandidate(evt).pageX
    const relativePositionX = (positionX - this.bcr.left) / this.bcr.width
    // ensure we do not go outside the progress bar
    const clampedPositionX = Math.max(0, Math.min(relativePositionX, 1))

    requestAnimationFrame(() => this.updateUI(clampedPositionX))
    return clampedPositionX
  }

  updateUI(normalizedPositionX: number) {
    this._trackUsed!.style.transform = `translate(-50%, -50%) scale(${normalizedPositionX})`
    this._seekerContainer!.style.transform = `translateX(${normalizedPositionX * 100}%)`
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('touchmove', this.onSwipeMove)
    document.removeEventListener('touchend', this.onSwipeEnd)
    document.removeEventListener('mousemove', this.onSwipeMove)
    document.removeEventListener('mouseup', this.onSwipeEnd)
    window.removeEventListener('resize', this.onResize)
  }

  protected render() {
    return html`
      <div class="progress-bar ${classMap({ 'progress-bar--disabled': !this.active })}"
           @mousedown="${this.onSwipeStart}" @touchstart="${this.onSwipeStart}>
          <div class=" progress-bar__track"></div>
      <div class="progress-bar__track-used"></div>
      <div class="progress-bar__seeker-container">
        <div class="progress-bar__seeker"></div>
      </div>
      </div>
    `
  }
}
