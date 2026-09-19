import player from '#ts/store/player/signals'
import { Track } from '#types/signals'
import { shuffle } from '#ts/utils'

export const setTracklist = (tracklist: Map<number, Track>, id: string) => {
  const queue = Array.from(tracklist.keys())

  player.tracklist.value = tracklist
  player.tracklistId.value = id
  player.queue.value = queue
}

export const setCurrentTrack = (queuePointerIndex: number) => {
  const queue = player.queue.value
  if (queue.length === 0) {
    console.error('ERROR: queue is empty...')
  }

  // O(1)
  player.queuePointerIndex.value = queuePointerIndex

  // activate player
  player.active.value = true

  // set playing status
  player.status.playing.value = true
}

export const setPlayingStatus = (playing: boolean) => {
  player.status.playing.value = playing
}

export const setCurrentTime = (currentTime: number) => {
  player.currentTime.value = currentTime
}

export const setPrevTrack = () => {
  // no track set
  if (player.queuePointerIndex.value === null) {
    return
  }

  const pointer = Math.max(0, player.queuePointerIndex.value - 1)
  player.queuePointerIndex.value = pointer
}

export const setNextTrack = () => {
  // no track set
  if (player.queuePointerIndex.value === null) {
    return
  }

  const repeat = player.status.repeat.value
  let pointer

  if (repeat) {
    pointer = (player.queuePointerIndex.value + 1) % player.queue.value.length
  } else {
    pointer = Math.min(player.queuePointerIndex.value + 1, player.queue.value.length - 1)
  }

  player.queuePointerIndex.value = pointer
}

export const toggleShuffle = (toShuffle: boolean) => {
  // TODO: fix, track is reset when toggle shuffling
  // update shuffle status
  player.status.shuffle.value = toShuffle

  // if not queue is set, bail (only UI will be updated)
  if (player.queue.value.length === 0 || player.queuePointerIndex.value === null) {
    return
  }

  // if we ask to shuffle the queue
  if (toShuffle) {
    // pop the current track from the queue
    const pointer = player.queuePointerIndex.value
    const currentTrackId = player.queue.value[pointer]
    const slicedQueue = [
      ...player.queue.value.slice(0, pointer),
      ...player.queue.value.slice(pointer + 1),
    ]

    // shuffle the rest of the queue
    const slicedQueueShuffle = shuffle(slicedQueue)

    // insert the current track id at the beginning of the queue and update the queue signal
    player.queue.value = [currentTrackId, ...slicedQueueShuffle]

    // reset the pointer
    player.queuePointerIndex.value = 0
  } else {
    // otherwise, reset the queue to its original order
    const currentTrackId = player.queue.value[player.queuePointerIndex.value]
    player.queue.value = Array.from(player.tracklist.value!.keys())

    // update the pointer to the current track
    player.queuePointerIndex.value = player.tracklist.value!.get(currentTrackId)!.index
  }
}
