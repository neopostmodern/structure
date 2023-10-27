export function urlAnalyzer(urlString) {
  const { hostname, pathname } = new URL(urlString)

  let suggestedName = hostname + pathname

  if (suggestedName[suggestedName.length - 1] === '/') {
    suggestedName = suggestedName.substr(0, suggestedName.length - 1)
  }

  let shortDomain = hostname
  if (hostname.substr(0, 3) === 'www') {
    shortDomain = hostname.substr(4)
  }

  return {
    domain: hostname,
    shortDomain,
    path: pathname,
    suggestedName,
  }
}
