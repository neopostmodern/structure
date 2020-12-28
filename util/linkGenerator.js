export const bookmarkletCode = (backendUrl, token) =>
  `javascript:void(open('${backendUrl}/bookmarklet?token=${token}&url='+encodeURIComponent(location.href)))`

export const rssFeedUrl = (backendUrl, token) =>
  `${backendUrl}/rss?token=${token}`
