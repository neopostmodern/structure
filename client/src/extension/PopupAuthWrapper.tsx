import { FC } from 'react'

import UserIdContext from '../renderer/utils/UserIdContext'
import useAuth from './hooks/useAuth'
import Popup from './Popup'
import PopupLayout from './PopupLayout'
import LoginScreen from './screens/LoginScreen'

const PopupAuthWrapper: FC = () => {
  const auth = useAuth()

  if (auth.authState === 'checking' || auth.authState === 'loading-profile') {
    return <PopupLayout loading />
  }

  if (auth.authState === 'logged-out') {
    return (
      <LoginScreen
        loggingIn={auth.loggingIn}
        loginError={auth.loginError}
        onLogIn={auth.logIn}
      />
    )
  }

  return (
    <UserIdContext.Provider value={auth.userId}>
      <Popup />
    </UserIdContext.Provider>
  )
}

export default PopupAuthWrapper
