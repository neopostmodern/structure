import styled from 'styled-components'
import { urlPrefixRegex } from '../util'

const HighlightDiff = styled.span`
  color: ${({ theme }) => theme.palette.text.primary};
  text-decoration: underline;
`
export const UrlDiff = ({
  url,
  referenceUrl,
}: {
  url: string
  referenceUrl: string | undefined
}) => {
  if (!referenceUrl) {
    return url
  }

  const urlWithoutPrefix = url.replace(urlPrefixRegex, '')
  const referenceUrlWithoutPrefix = referenceUrl.replace(urlPrefixRegex, '')

  const urlPrefix = url.match(urlPrefixRegex)?.[0]
  let commonUrl = ''
  let difference = ''

  for (
    let charPosition = 0;
    charPosition <
    Math.min(urlWithoutPrefix.length, referenceUrlWithoutPrefix.length);
    charPosition++
  ) {
    if (
      urlWithoutPrefix[charPosition] !== referenceUrlWithoutPrefix[charPosition]
    ) {
      break
    }

    commonUrl += urlWithoutPrefix[charPosition]
  }
  difference = urlWithoutPrefix.substring(commonUrl.length)

  return (
    <>
      {urlPrefix !== referenceUrl.match(urlPrefixRegex)?.[0] ? (
        <HighlightDiff>{urlPrefix}</HighlightDiff>
      ) : null}
      {commonUrl}
      <HighlightDiff>{difference}</HighlightDiff>
    </>
  )
}
