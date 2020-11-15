import React, { useEffect } from 'react'
import { NetworkStatus, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '../reducers'
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout'
import { Versions } from '../generated/Versions'
import { requestLogin } from '../actions/userInterface'
import Centered from './Centered'
import LoginView from './LoginView'
import VersionMarks from './VersionMarks'

import * as Styled from './Layout.style'
import { InlineButton, InternalLink } from './CommonStyles'

const PROFILE_QUERY = gql`
  query CurrentUserForLayout {
    currentUser {
      _id
      name
    }
  }
`
const VERSIONS_QUERY = gql`
  query Versions {
    versions {
      minimum
      recommended
    }
  }
`

const Layout: React.FC<{}> = ({ children }) => {
  const dispatch = useDispatch()
  const user = useQuery<CurrentUserForLayout>(PROFILE_QUERY)

  const versions = useQuery<Versions>(VERSIONS_QUERY)

  const isUserLoggingIn = useSelector<RootState, boolean>(
    (state) => state.userInterface.loggingIn,
  )
  const path = useSelector<RootState, string>(
    (state) => state.router.location.pathname,
  )

  useEffect(() => {
    user.refetch()
  }, [isUserLoggingIn])

  let headline = <>Structure</>
  if (path !== '/') {
    headline = (
      <span>
        <InternalLink to='/'>/</InternalLink>
        {path.substr(1)}
      </span>
    )
  }

  let content
  let userIndicator

  if (
    versions.networkStatus === NetworkStatus.error ||
    user.networkStatus === NetworkStatus.error
  ) {
    return (
      <Styled.Container>
        <Centered>
          <h2>Network error.</h2>
          This really should not have happened.
          <br />
          <br />
          <InlineButton
            type='button'
            onClick={(): void => window.location.reload()}
          >
            Give it another try.
          </InlineButton>
        </Centered>
      </Styled.Container>
    )
  }

  if (isUserLoggingIn) {
    content = <Centered>Logging in...</Centered>
  } else if (user.loading) {
    content = <Centered>Loading...</Centered>
  } else if (user.data.currentUser?.name) {
    content = children
    userIndicator = (
      <Styled.Username to='/me'>{user.data.currentUser.name}.</Styled.Username>
    )
  } else {
    content = (
      <LoginView
        openLoginModal={(): void => {
          dispatch(requestLogin())
        }}
      />
    )
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Title>{headline}</Styled.Title>
        <Styled.UserIndicator>{userIndicator}</Styled.UserIndicator>
      </Styled.Header>
      <VersionMarks
        versions={versions.loading ? 'loading' : versions.data.versions}
      />
      {content}
    </Styled.Container>
  )
}

export default Layout
