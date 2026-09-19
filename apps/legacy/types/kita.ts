declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['stw-library']: HtmlTag
      ['stw-tracklist']: HtmlTag
      ['stw-download-switch']: HtmlTag
      ['stw-track']: HtmlTag
      ['stw-player']: HtmlTag
      ['stw-progress']: HtmlTag
      ['stw-volume']: HtmlTag
      ['stw-settings']: HtmlTag
    }

    interface HtmlTag {
      // unpoly
      ['up-main']?: boolean
      ['up-hungry']?: boolean
      ['up-keep']?: boolean
      ['up-source']?: string
      ['load-fragment']?: boolean

      // custom elements
      ['cdn']?: string
      ['userid']?: string
    }

    interface HtmlAnchorTag {
      ['up-follow']?: boolean
      ['up-target']?: string
      ['up-layer']?: 'new' | 'swap' | 'shatter'
      ['up-accept-location']?: string
      ['up-mode']?: 'root' | 'modal' | 'drawer' | 'popup' | 'cover'
      ['up-on-accepted']?: string
    }

    interface HtmlFormTag {
      ['up-submit']?: boolean
      ['up-target']?: string
    }
  }
}
