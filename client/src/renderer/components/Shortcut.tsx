import { Paper } from '@mui/material'
import { FC, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { getKeyForDisplay, GLOBAL } from '../utils/keyboard'

type KeyProps = { inline?: boolean }
const Key = styled(Paper).attrs<KeyProps>(({ inline }) => ({
  variant: inline ? 'outlined' : undefined,
}))<KeyProps>`
  display: inline-block;
  padding: 0.1em 0.4em;
  border-radius: 2px;
  background-color: #222;
  color: white;

  ${({ inline }) =>
    inline &&
    css`
      padding: 0 0.3em;
      font-weight: bold;
      font-size: 95%;
    `}
`

const Shortcut: FC<{ shortcuts: Array<string>; inline?: boolean }> = ({
  shortcuts,
  inline,
}) => {
  return (
    <>
      {shortcuts[0]
        .replace(GLOBAL, '')
        .split('+')
        .map((part, partIndex, allParts) => (
          <Fragment key={part}>
            <Key inline={inline}>{getKeyForDisplay(part)}</Key>
            {partIndex < allParts.length - 1 && ' + '}
          </Fragment>
        ))}
    </>
  )
}

export default Shortcut
