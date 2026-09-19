export interface Track {
  index: number
  title: string
  artist: string
  album: string
  duration: number
  coverUrl: string
  manifest: string
  playlist: string
}

type DownloadQuality = 128 | 192 | 256

export interface Settings {
  fade: number
  downloadQuality: DownloadQuality
  limitData: boolean
  maxData: number
}
