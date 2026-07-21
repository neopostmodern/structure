import { ArrowBack } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { FC, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBackendUrl } from '../../renderer/actions/configuration'
import AdvancedSettings from '../../renderer/components/AdvancedSettings'
import Configuration from '../../renderer/components/Configuration'
import { ConfigurationStateType } from '../../renderer/reducers/configuration'
import { closeSettings } from '../actions/settings'
import PopupLayout from '../PopupLayout'
import { ExtensionRootState } from '../store'

const SettingsScreen: FC = () => {
  const dispatch = useDispatch()
  const { backendUrl, backendUrlDefault } = useSelector<
    ExtensionRootState,
    ConfigurationStateType
  >((state) => state.configuration)

  const handleClose = useCallback(() => dispatch(closeSettings()), [dispatch])
  const handleChangeBackendUrl = useCallback(
    (newBackendUrl: string): void => {
      dispatch(setBackendUrl(newBackendUrl))
    },
    [dispatch],
  )

  return (
    <PopupLayout
      topBarActions={
        <IconButton onClick={handleClose} sx={{ marginRight: 'auto' }}>
          <ArrowBack />
        </IconButton>
      }
      showConfigNav={false}
    >
      <Configuration
        currentBackendUrl={backendUrl}
        defaultBackendUrl={backendUrlDefault}
        onChangeBackendUrl={handleChangeBackendUrl}
      />
      <AdvancedSettings />
    </PopupLayout>
  )
}

export default SettingsScreen
