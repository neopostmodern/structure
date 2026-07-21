export const OPEN_SETTINGS = 'OPEN_SETTINGS'
export const CLOSE_SETTINGS = 'CLOSE_SETTINGS'

export function openSettings() {
  return { type: OPEN_SETTINGS }
}

export function closeSettings() {
  return { type: CLOSE_SETTINGS }
}
