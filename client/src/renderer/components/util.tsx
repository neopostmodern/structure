import styled, { css } from 'styled-components'

export const SmallGrayTextStyle = css`
  font-size: 0.8em;
  color: gray;
`
export const SmallGrayText = styled.div<{ capitalize?: boolean }>`
  ${SmallGrayTextStyle}
  ${({ capitalize }) => (capitalize ? 'text-transform: uppercase;' : '')}
`
