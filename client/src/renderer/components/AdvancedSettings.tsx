import { useApolloClient } from '@apollo/client';
import { Typography } from '@mui/material';
import { ENTITIES_UPDATED_SINCE_STORAGE_KEY } from '../hooks/useEntitiesUpdatedSince';
import { clearApolloCache } from '../utils/cache';
import SettingsEntry from './SettingsEntry';

const AdvancedSettings = () => {
  const apolloClient = useApolloClient();

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
          localStorage.removeItem(ENTITIES_UPDATED_SINCE_STORAGE_KEY);
          window.location.reload();
        }}
      />
    </>
  );
};

export default AdvancedSettings;
