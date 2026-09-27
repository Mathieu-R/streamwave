export const colorModeStorageKey = 'streamwave-color-mode'

export const getNextColorMode = (resolvedTheme?: string) =>
  resolvedTheme === 'dark' ? 'light' : 'dark'
