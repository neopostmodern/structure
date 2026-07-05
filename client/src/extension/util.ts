export const urlPrefixRegex = /https?:\/\/(?:www.)?/
export const moreCanonicalUrl = (url: string) =>
  url.split('#')[0].split('?')[0].replace(urlPrefixRegex, '')
