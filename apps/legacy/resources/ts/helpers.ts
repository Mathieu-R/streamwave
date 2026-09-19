export function formatDuration(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function pluralize(text: string, value: number) {
  return value > 1 ? `${text}s` : text
}
