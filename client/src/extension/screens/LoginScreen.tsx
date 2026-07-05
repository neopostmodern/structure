import { Box, Button } from '@mui/material'
import { FC } from 'react'
import Centered from '../../renderer/components/Centered'
import ErrorSnackbar from '../../renderer/components/ErrorSnackbar'
import { SmallGrayText } from '../../renderer/components/util'
import PopupLayout from '../PopupLayout'

const LoginScreen: FC<{
  loggingIn: boolean
  loginError: Error | undefined
  onLogIn: () => void
}> = ({ loggingIn, loginError, onLogIn }) => (
  <PopupLayout>
    <ErrorSnackbar error={loginError} actionDescription='log in' />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      <div>
        <b>Structure</b>
      </div>
      <Centered height='5rem'>
        <Button variant='outlined' onClick={onLogIn} disabled={loggingIn}>
          {loggingIn ? 'Logging in…' : 'Log in with GitHub'}
        </Button>
      </Centered>
      <div>
        <SmallGrayText>
          Using backend at {__BACKEND_URL__.replace(/https?:\/\//, '')}
        </SmallGrayText>
      </div>
    </Box>
  </PopupLayout>
)

export default LoginScreen
