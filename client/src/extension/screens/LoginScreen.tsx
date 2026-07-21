import { Box, Button } from '@mui/material'
import { FC, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import Centered from '../../renderer/components/Centered'
import ErrorSnackbar from '../../renderer/components/ErrorSnackbar'
import { SmallGrayText } from '../../renderer/components/util'
import { openSettings } from '../actions/settings'
import PopupLayout from '../PopupLayout'

const LoginScreen: FC<{
  loggingIn: boolean
  loginError: Error | undefined
  onLogIn: () => void
}> = ({ loggingIn, loginError, onLogIn }) => {
  const dispatch = useDispatch()
  const handleOpenSettings = useCallback(
    () => dispatch(openSettings()),
    [dispatch],
  )

  return (
    <PopupLayout showAppTitle={true}>
      <ErrorSnackbar error={loginError} actionDescription='log in' />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <Centered height='5rem'>
          <Button variant='outlined' onClick={onLogIn} disabled={loggingIn}>
            {loggingIn ? 'Logging in…' : 'Log in with GitHub'}
          </Button>
        </Centered>
        <div>
          <SmallGrayText>
            Using backend at {__BACKEND_URL__.replace(/https?:\/\//, '')}{' '}
            <button
              type='button'
              onClick={handleOpenSettings}
              style={{
                background: 'none',
                textDecoration: 'underline',
                border: 'none',
                display: 'inline',
                color: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              configure
            </button>
          </SmallGrayText>
        </div>
      </Box>
    </PopupLayout>
  )
}

export default LoginScreen
