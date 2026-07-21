import { Typography } from '@mui/material'
import { useCallback } from 'react'
import SettingsEntry from './SettingsEntry'
import { StructureTextField } from './formComponents'

const Configuration = ({
  currentBackendUrl,
  defaultBackendUrl,
  onChangeBackendUrl,
}: {
  currentBackendUrl: string
  defaultBackendUrl: string
  onChangeBackendUrl: (newValue: string) => void
}) => {
  const handleBackendUrlChange = useCallback((): void => {
    onChangeBackendUrl(
      (
        document.getElementById(
          'configuration__backend-url',
        ) as HTMLInputElement
      ).value,
    )
  }, [onChangeBackendUrl])

  return (
    <>
      <Typography variant='h2'>Configuration</Typography>
      <SettingsEntry
        title='Server'
        actionTitle='Update'
        actionHandler={handleBackendUrlChange}
        readOnly={__BUILD_TARGET__ === 'web'}
        comment={
          <>
            The backend server is in charge of storing your data (username,
            notes, tags, et cetera). You must trust this server (and/or the
            operator of it), since your data is only encrypted during the
            transport to the server, not on the server. This means the operator
            of the server can (theoretically) read and/or modify all your data.
            <br />
            {__BUILD_TARGET__ === 'web' ? (
              <>This setting can not be changed in the web version.</>
            ) : (
              <>
                Modifying the backend server URL causes a restart.{' '}
                <b>
                  Setting an invalid value might make it impossible to restart
                  the app.
                </b>{' '}
                Data is not migrated automatically when switching backend
                servers.
                <br />
                Default: {defaultBackendUrl}
              </>
            )}
          </>
        }
      >
        <StructureTextField
          id='configuration__backend-url'
          type='text'
          defaultValue={currentBackendUrl}
          placeholder={defaultBackendUrl}
          disabled={__BUILD_TARGET__ === 'web'}
        />
      </SettingsEntry>
    </>
  )
}

export default Configuration
