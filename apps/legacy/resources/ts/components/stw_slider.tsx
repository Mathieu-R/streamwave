import { css, html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('stw-slider')
export default class STWSlider extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      --slider-height: 5px;
    }

    .wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      gap: 10px;
      height: 100%;
    }

    .slider {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      height: 100%;
      border-radius: 5px;
    }

    .slider__track {
      position: absolute;
      top: 50%;
      left: 50%;
      height: var(--slider-height);
      width: 100%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.5);
    }

    .slider__track-used {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: var(--slider-height);
      background: #fff;
      border-radius: 5px;
      transform: translate(-50%, -50%) scale(0);
      transform-origin: 0 50%;
      will-change: transform;
    }

    .slider__seeker-container {
      position: relative;
      width: 100%;
      height: var(--slider-height);
      background: 0 0;
      border: none;
      outline: none;
      pointer-events: none;
    }

    .slider__seeker {
      position: absolute;
      top: 50%;
      left: -12px;
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

    .slider__seeker--active {
      box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1);
    }
  `

  @property({ type: Number })
  defaultvalue = 0

  private bcr: null | DOMRect
  private dragging: boolean

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
  get _slider() {
    return this.renderRoot?.querySelector<HTMLElement>('.slider') ?? null
  }

  get _trackUsed() {
    return this.renderRoot?.querySelector<HTMLElement>('.slider__track-used') ?? null
  }

  get _seekerContainer() {
    return this.renderRoot?.querySelector<HTMLElement>('.slider__seeker-container') ?? null
  }

  get _seeker() {
    return this.renderRoot?.querySelector<HTMLElement>('.slider__seeker') ?? null
  }

  connectedCallback() {
    super.connectedCallback()

    document.addEventListener('touchmove', this.onSwipeMove, { passive: true })
    document.addEventListener('touchend', this.onSwipeEnd, { passive: true })
    document.addEventListener('mousemove', this.onSwipeMove, { passive: true })
    document.addEventListener('mouseup', this.onSwipeEnd, { passive: true })
    window.addEventListener('resize', this.onResize)
  }

  firstUpdated() {
    this.onResize()
    this.updateUI(Number.parseInt(this.defaultvalue))
  }

  onResize() {
    // TODO: FIX bcr is not right
    this.bcr = this._slider!.getBoundingClientRect()
    console.log(this.bcr.width, this.bcr.left)
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

    // focus on seeker element
    this._seekerContainer!.focus()
    this.dragging = true
    this._seeker!.classList.add('slider__seeker--active')
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
    this._seeker!.classList.remove('slider__seeker--active')

    const clampedPosition = this.updatePosition(evt)

    if (clampedPosition !== undefined) {
      this.dispatchEvent(new CustomEvent('seek', { detail: { position: clampedPosition } }))
    }
  }

  updatePosition(evt: TouchEvent | MouseEvent) {
    if (!this.bcr) {
      return
    }

    const positionX = this.findCandidate(evt).pageX
    const relativePositionX = (positionX - this.bcr.left) / this.bcr.width
    // ensure we do not go outside the progress bar
    const clampedPositionX = Math.max(0, Math.min(relativePositionX, 1))

    // update UI
    requestAnimationFrame(() => this.updateUI(clampedPositionX))

    // return clamped position
    return clampedPositionX
  }

  updateUI(normalizedPositionX: number) {
    console.log(normalizedPositionX)
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
      <div class="slider" @mousedown="${this.onSwipeStart}" @touchstart="${this.onSwipeStart}">
        <div class="slider__track"></div>
        <div class="slider__track-used"></div>
        <div class="slider__seeker-container">
          <div class="slider__seeker"></div>
        </div>
      </div>
    `
  }
}
