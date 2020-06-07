export function bookmarkletCode(backendUrl, token) {
  return `javascript:void(open('${backendUrl}/bookmarklet?token=${token}&url='+encodeURIComponent(location.href)))`;
}

export const rssFeedUrl = (backendUrl, token) => {
  return `${backendUrl}/rss?token=${token}`;
}
