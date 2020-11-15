import styled from 'styled-components'
import { baseFont, breakPointMobile, containerWidth } from '../styles/constants'
import { InternalLink } from './CommonStyles'

export const Container = styled.div`
  font-family: ${baseFont};
  max-width: ${containerWidth};
  margin: 2rem auto 5rem;

  @media (max-width: ${breakPointMobile}) {
    margin-top: 0;
  }
`

export const Header = styled.header`
  display: flex;

  @media (max-width: ${breakPointMobile}) {
    flex-direction: column;
  }
`

export const Title = styled.h1`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  margin: 0;

  font-size: 5rem;
  font-weight: bold;
  letter-spacing: -0.025em;

  @media (max-width: ${breakPointMobile}) {
    font-size: 15vw;
  }

  a {
    color: blue;
  }
`

export const UserIndicator = styled.div`
  margin-left: auto;

  @media (max-width: ${breakPointMobile}) {
    order: -1;
  }
`

export const Username = styled(InternalLink)`
  color: black;
  opacity: 1;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`
