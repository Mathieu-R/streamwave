import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { SignalWatcher } from '@lit-labs/preact-signals'
// @ts-expect-error
import shaka from 'shaka-player'

import player from '../store/player/signals.js'
import {
  setCurrentTime,
  setPrevTrack,
  setNextTrack,
  toggleShuffle,
  setPlayingStatus,
} from '../store/player/mutations.js'

import { Track } from '#types/signals'
import Constants from '../constants.js'

import './stw_progress.js'
import './stw_volume.js'

@customElement('stw-player')
export default class STWPlayer extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 25% 1fr 25%;
      gap: 20px;
      padding: 15px;
      background: #000;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
    }

    .player__track-infos {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
    }

    .player__track-cover {
      height: 84px;
      width: 84px;
    }

    .player__track-title {
      margin: 5px 0;
    }

    .player__track-artist {
      margin: 0;
      font-size: 14px;
      color: var(--color-surface-700);
    }

    .player__controls-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .player__controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;

      img {
        width: 32px;
        height: 32px;
      }
    }

    .player__shuffle svg,
    .player__repeat svg {
      width: 24px;
      height: 24px;
    }

    .player__play img {
      width: 42px;
      height: 42px;
    }

    .player__play[disabled],
    .player__previous[disabled],
    .player__next[disabled] {
      opacity: 0.5;
      cursor: default;
    }

    .player__aside-wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  `

  @property({ type: String })
  cdn!: string

  @property({ type: Number })
  userid!: number

  @property({ type: Object })
  player: shaka.Player | null

  @property({ type: Object })
  castProxy: shaka.cast.CastProxy | null

  @property({ type: Object })
  remoteAudio: HTMLAudioElement | null

  @property({ type: Object })
  remotePlayer: shaka.Player | null

  @property({ type: Boolean })
  tracking: boolean

  @property()
  skipTime: number

  @state()
  currentTrack: Track | null

  constructor() {
    super()

    this.player = null
    this.castProxy = null

    this.remoteAudio = null
    this.remotePlayer = null

    this.currentTrack = null
    this.tracking = false

    this.skipTime = 15

    this.trackTimeUpdate = this.trackTimeUpdate.bind(this)
  }

  get _audio() {
    return document.querySelector<HTMLAudioElement>('.audio')!
  }

  connectedCallback() {
    super.connectedCallback()

    this.initShakaPlayer().then(() => {
      // media session API
      this.initMediaSession()
      this.addEventListeners()
    })

    // listen to queue pointer index changes
    player.currentTrack.subscribe((track) => {
      // pointer is null => no track set for listening
      // however, this is the default value, so I guess the callback should never fire with null value
      if (!track) {
        return
      }

      this.listen(track, true)
        .then(() => {
          this.currentTrack = track
        })
        .catch((err: Error) => {
          this.player!.unload()
          console.error(err)
        })
    })
  }

  addEventListeners() {
    this._audio.addEventListener('play', () => {
      // start time tracking
      requestAnimationFrame(this.trackTimeUpdate)
    })

    this._audio.addEventListener('pause', () => {
      // stop time tracking
      this.tracking = false
    })

    this._audio.addEventListener('ended', (e) => {
      setNextTrack()
      console.log(e)
    })

    // changing track
    this._audio.addEventListener('durationchange', (e) => {
      console.log(e)
    })
  }

  async initShakaPlayer() {
    shaka.polyfill.installAll()

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...')
      return
    }

    this.player = new shaka.Player()
    await this.player.attach(this._audio)

    this.castProxy = new shaka.cast.CastProxy(this._audio, this.player, Constants.PRESENTATION_ID)
    this.remoteAudio = this.castProxy.getVideo()
    this.remotePlayer = this.castProxy.getPlayer()

    // player accessible anywhere
    // @ts-expect-error
    window.player = this.player

    // player event listeners
    this.playerEventListeners()
  }

  playerEventListeners() {
    this.player.addEventListener('error', (evt: any) => {
      console.error('Shaka player error')
      evt.detail.map((err: Error) => console.error(err))
    })
  }

  initMediaSession() {
    if (!Constants.SUPPORT_MEDIA_SESSION_API) {
      return
    }

    navigator.mediaSession.setActionHandler('play', (_) => {
      setPlayingStatus(true)
      this.play()
    })
    navigator.mediaSession.setActionHandler('pause', (_) => {
      setPlayingStatus(false)
      this.pause()
    })
    navigator.mediaSession.setActionHandler('seekbackward', this.onSeekBackwardClick)
    navigator.mediaSession.setActionHandler('seekforward', this.onSeekForwardClick)
    navigator.mediaSession.setActionHandler('previoustrack', this.onPrevClick)
    navigator.mediaSession.setActionHandler('nexttrack', this.onNextClick)
  }

  setMediaNotifications(title: string, artist: string, album: string, coverUrl: string) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title,
      artist: artist,
      album: album,
      artwork: [
        { src: `${this.cdn}/${coverUrl}`, sizes: '256x256', type: 'image/png' },
        { src: `${this.cdn}/${coverUrl}`, sizes: '512x512', type: 'image/png' },
      ],
    })
  }

  initWebAudioApi() {}

  async listen(track: Track, play: boolean) {
    if (!this.remotePlayer) {
      return
    }

    // load track
    await this.remotePlayer.load(`${this.cdn}/${track.manifest}`)
    console.log(`[shaka-player] Music loaded: ${track.manifest}`)

    play ? await this.play() : this.pause()

    // set media notifications if supported
    if (Constants.SUPPORT_MEDIA_SESSION_API) {
      this.setMediaNotifications(track.title, track.artist, track.album, track.coverUrl)
    }
  }

  play() {
    return this.remoteAudio?.play()
  }

  pause() {
    return this.remoteAudio?.pause()
  }

  seek(time: number) {
    this._audio.currentTime = time
  }

  onPlayPauseClick() {
    const isPlaying = player.status.playing.value

    // switch playing status
    setPlayingStatus(!isPlaying)

    isPlaying ? this.pause() : this.play()
  }

  onPrevClick() {
    const currentTime = this._audio!.currentTime

    // if media has been listened for more than 2 seconds, go back to the beginning
    if (currentTime > 2) {
      this.seek(0)
      return
    }

    setPrevTrack()
  }

  onNextClick() {
    setNextTrack()
  }

  onSeekBackwardClick() {
    this._audio.currentTime = Math.max(0, this._audio.currentTime - this.skipTime)
  }

  onSeekForwardClick() {
    this._audio.currentTime = Math.min(
      this._audio.duration,
      this._audio.currentTime + this.skipTime
    )
  }

  onRepeatClick() {
    player.status.repeat.value = !player.status.repeat.value
  }

  onShuffleClick() {
    toggleShuffle(!player.status.shuffle.value)
  }

  trackTimeUpdate() {
    if (this.tracking) {
      return
    }

    // recursively call this function for 60fps track time update
    requestAnimationFrame(this.trackTimeUpdate)

    // update current time signal
    const { currentTime } = this._audio
    setCurrentTime(currentTime)
  }

  renderPlayPause() {
    return player.status.playing.value
      ? html`<img src="/resources/assets/svg/pause.svg" alt="pause" />`
      : html`<img src="/resources/assets/svg/play.svg" alt="play" />`
  }

  renderRepeatSVG() {
    const repeat = player.status.repeat.value

    return html`
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M17 2L21 6M21 6L17 10M21 6H7.8C6.11984 6 5.27976 6 4.63803 6.32698C4.07354 6.6146 3.6146 7.07354 3.32698 7.63803C3 8.27976 3 9.11984 3 10.8V11M3 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V13M3 18L7 22M3 18L7 14"
            stroke="${repeat ? '#1d54d6' : '#FFF'}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    `
  }

  renderShuffleSVG() {
    const shuffle = player.status.shuffle.value

    return html`
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M18 15L21 18M21 18L18 21M21 18H18.5689C17.6297 18 17.1601 18 16.7338 17.8705C16.3564 17.7559 16.0054 17.5681 15.7007 17.3176C15.3565 17.0348 15.096 16.644 14.575 15.8626L14.3333 15.5M18 3L21 6M21 6L18 9M21 6H18.5689C17.6297 6 17.1601 6 16.7338 6.12945C16.3564 6.24406 16.0054 6.43194 15.7007 6.68236C15.3565 6.96523 15.096 7.35597 14.575 8.13744L9.42496 15.8626C8.90398 16.644 8.64349 17.0348 8.29933 17.3176C7.99464 17.5681 7.64357 17.7559 7.2662 17.8705C6.83994 18 6.37033 18 5.43112 18H3M3 6H5.43112C6.37033 6 6.83994 6 7.2662 6.12945C7.64357 6.24406 7.99464 6.43194 8.29933 6.68236C8.64349 6.96523 8.90398 7.35597 9.42496 8.13744L9.66667 8.5"
            stroke="${shuffle ? '#1d54d6' : '#FFF'}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
      </svg>
    `
  }

  render() {
    return html`
      <div class='player__track-infos'>
        <img class="player__track-cover" src=${this.cdn}/${ifDefined(this.currentTrack?.coverUrl)} alt="cover"/>
        <div>
          <p class="player__track-title">${this.currentTrack?.title}</p>
          <p class="player__track-artist">${this.currentTrack?.artist}</p>
        </div>
      </div>
      <div class="player__controls-wrapper">
        <div class='player__controls'>
          <button class="player__shuffle" @click="${this.onShuffleClick}">
            <div>${this.renderShuffleSVG()}</div>
          </button>
          <button class="player__seek_backward" @click="${this.onSeekBackwardClick}">
            <img src='/resources/assets/svg/seek_backward.svg' alt="seek backward"/>
          </button>
          <button class="player__previous" @click="${this.onPrevClick}" ?disabled="${!player.active.value}">
            <img src='/resources/assets/svg/previous.svg' alt="previous"/>
          </button>
          <button class="player__play" @click="${this.onPlayPauseClick}" ?disabled="${!player.active.value}">
            ${this.renderPlayPause()}
          </button>
          <button class="player__next" @click="${this.onNextClick}" ?disabled="${!player.active.value}">
            <img src='/resources/assets/svg/next.svg' alt="next"/>
          </button>
          <button class="player__seek_forward" @click="${this.onSeekForwardClick}">
            <img src='/resources/assets/svg/seek_forward.svg' alt="seek forward"/>
          </button>
          <button class="player__repeat" @click="${this.onRepeatClick}">
            ${this.renderRepeatSVG()}
          </button>
        </div>
        <stw-progress class='player__progress-bar progress-bar'></stw-progress>
      </div>
      </div>
      <div class='player__aside-wrapper'>
        <button class="player__chromecast">
          <img src='/resources/assets/svg/cast.svg' alt="chromecast"/>
        </button>
        <stw-volume class="player__volume"></stw-volume>
      </div>
    `
  }
}
