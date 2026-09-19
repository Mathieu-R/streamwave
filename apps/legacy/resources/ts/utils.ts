// Fisher-Yates shuffle
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))

    let t = array[i]
    array[i] = array[j]
    array[j] = t
  }

  return array
}
