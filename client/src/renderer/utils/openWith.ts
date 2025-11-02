export const openInDefaultBrowser = (url: string): void => {
  window.open(url, '_blank', 'noopener, noreferrer')
}

export const shareUrl = (url: string, title?: string): void => {
  navigator.share({
    title,
    url,
  })
}
