import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { requestLogin } from '../actions/userInterface'
import Centered from './Centered'

import LoginView from './LoginView'
import VersionMarks from './VersionMarks'
import { RootState } from '../reducers'
import { CurrentUserForLayout } from '../generated/CurrentUserForLayout'
import { Versions } from '../generated/Versions'

import styles from './Layout.scss'

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
        <Link to='/'>/</Link>
        {path.substr(1)}
      </span>
    )
  }

  let content
  let userIndicator

  if (isUserLoggingIn) {
    content = <Centered>Logging in...</Centered>
  } else if (user.loading) {
    content = <Centered>Loading...</Centered>
  } else if (user.data.currentUser?.name) {
    content = children
    userIndicator = (
      <Link to='/me' className={styles.username}>
        {user.data.currentUser.name}.
      </Link>
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
    <div>
      <div className={styles.container}>
        <header>
          <h2 className={styles.title}>{headline}</h2>
          <div className={styles.userIndicator}>{userIndicator}</div>
        </header>
        <VersionMarks
          versions={versions.loading ? 'loading' : versions.data.versions}
        />
        {content}
      </div>
    </div>
  )
}

export default Layout
