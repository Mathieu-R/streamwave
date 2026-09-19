import { computed, signal } from '@lit-labs/preact-signals'
import { Track } from '#types/signals'

const player = {
  // loaded tracks (album, playlist, etc...)
  tracklist: signal<Map<number, Track> | null>(null),
  // id of track list to avoid updating list of tracks if not needed
  tracklistId: signal<string | null>(null),
  // queue of tracks index to play (can be shuffled)
  queue: signal<number[]>([]),
  // index of current track in queue
  queuePointerIndex: signal<number | null>(null),
  active: signal(false),
  currentTrack: signal<Track | null>(null),
  currentTime: signal(null),
  status: {
    playing: signal(false),
    repeat: signal(false),
    shuffle: signal(false),
    chromecastAvailable: signal(false),
    chromecastConnected: signal(false),
  },
}

const currentTrack = computed(() => {
  if (!player.active) {
    return
  }

  const queue = player.queue.value
  const pointer = player.queuePointerIndex.value

  if (queue.length === 0 || pointer === null) {
    return
  }

  const trackId = queue[pointer]
  return { id: trackId, ...player.tracklist.value!.get(trackId) }
})

export default {
  ...player,
  currentTrack,
}
