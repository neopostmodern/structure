import { useApolloClient } from '@apollo/client';
import { Typography } from '@mui/material';
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
          window.location.reload();
        }}
      />
    </>
  );
};

export default AdvancedSettings;
