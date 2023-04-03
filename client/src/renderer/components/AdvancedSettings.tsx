import { useApolloClient } from '@apollo/client';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { NetworkMode, setNetworkMode } from '../actions/configuration';
import { ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY } from '../hooks/useEntitiesUpdatedSince';
import { RootState } from '../reducers';
import { clearApolloCache } from '../utils/cache';
import SettingsEntry from './SettingsEntry';

const networkModeNames = {
  [NetworkMode.AUTO]: 'Auto',
  [NetworkMode.FORCE_OFFLINE]: 'Force offline',
  [NetworkMode.FORCE_ONLINE]: 'Force online',
};

const AdvancedSettings = () => {
  const apolloClient = useApolloClient();
  const networkMode = useSelector<RootState, NetworkMode>(
    (state) => state.configuration.networkMode
  );
  const dispatch = useDispatch();

  return (
    <>
      <Typography variant="h2">Advanced</Typography>
      <SettingsEntry
        title="Cache"
        comment={`${
          Object.keys(apolloClient.cache.data.data).length
        } cache entries`}
        actionTitle="Clear cache"
        actionHandler={() => {
          clearApolloCache();
          localStorage.removeItem(ENTITIES_UPDATED_SINCE_CACHE_ID_STORAGE_KEY);
          window.location.reload();
        }}
      />
      <SettingsEntry title="Network mode">
        <Box display="flex" justifyContent="flex-end">
          <Select
            variant="standard"
            value={networkMode}
            onChange={(event) => {
              dispatch(setNetworkMode(event.target.value as NetworkMode));
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
  );
};

export default AdvancedSettings;
