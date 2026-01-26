import { useApolloClient } from '@apollo/client/react'
import { Box, MenuItem, Select, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  NetworkMode,
  setLogLevel,
  setNetworkMode,
} from '../actions/configuration'
import { RootState } from '../reducers'
import { clearApolloCache } from '../utils/cache'
import { LogLevelNumber } from '../utils/logger'
import SettingsEntry from './SettingsEntry'

const networkModeNames = {
  [NetworkMode.AUTO]: 'Auto',
  [NetworkMode.FORCE_OFFLINE]: 'Force offline',
  [NetworkMode.FORCE_ONLINE]: 'Force online',
}

const AdvancedSettings = () => {
  const apolloClient = useApolloClient()
  const networkMode = useSelector<RootState, NetworkMode>(
    (state) => state.configuration.networkMode,
  )
  const logLevelNumber = useSelector<RootState, LogLevelNumber>(
    (state) => state.configuration.logLevel,
  )
  const dispatch = useDispatch()

  return (
    <>
      <Typography variant='h2'>Advanced</Typography>
      <SettingsEntry title='Log level'>
        <Box display='flex' justifyContent='flex-end'>
          <Select
            variant='standard'
            value={logLevelNumber}
            onChange={(event) => {
              dispatch(setLogLevel(event.target.value as LogLevelNumber))
            }}
          >
            {Object.entries(LogLevelNumber)
              .filter(
                ([logLevelName]) => isNaN(logLevelName as unknown as number), // weird trick to filter out double mapped enum entries
              )
              .map(([logLevelName, logLevelNumber]) => (
                <MenuItem value={logLevelNumber}>{logLevelName}</MenuItem>
              ))}
          </Select>
        </Box>
      </SettingsEntry>
      <SettingsEntry
        title='Cache'
        comment={`${
          Object.keys(apolloClient.cache.data.data).length
        } cache entries`}
        actionTitle='Clear cache'
        actionHandler={() => {
          clearApolloCache()
          window.location.reload()
        }}
      />
      <SettingsEntry title='Network mode'>
        <Box display='flex' justifyContent='flex-end'>
          <Select
            variant='standard'
            value={networkMode}
            onChange={(event) => {
              dispatch(setNetworkMode(event.target.value as NetworkMode))
            }}
          >
            {Object.values(NetworkMode).map((networkMode) => (
              <MenuItem value={networkMode}>
                {networkModeNames[networkMode]}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </SettingsEntry>
    </>
  )
}

export default AdvancedSettings
