import React from 'react'
import styled from 'styled-components'

import Centered from './Centered'

interface LoginViewProps {
  openLoginModal: () => void
}

const LoginButton = styled.button`
  border: 1px solid black;
  background: none;

  padding: 0.3em 1.2em;

  font-size: 2rem;
`

const LoginView: React.FC<LoginViewProps> = ({ openLoginModal }) => (
  <>
    <b>
      A performance-at-interaction oriented and reasonably stylish bookmarking
      tool for (eventually) everything.
    </b>
    <Centered>
      <LoginButton type='button' onClick={openLoginModal}>
        Log in
      </LoginButton>
    </Centered>
    Read the documentation on{' '}
    <a href='https://bericht.neopostmodern.com/posts/how-to-structure'>
      bericht.neopostmodern.com
    </a>
    .
    {process.env.TARGET === 'web' ? (
      <>
        {' '}
        Get it on{' '}
        <a href='https://github.com/neopostmodern/structure/releases/latest'>
          GitHub
        </a>
        !
      </>
    ) : null}
  </>
)

export default LoginView
