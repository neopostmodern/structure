import React from 'react';
import { TextField } from './CommonStyles';
import SettingsEntry from './SettingsEntry';

const Credentials = ({
  credentials,
  revokeCredential,
  requestNewCredential,
}) => {
  if (credentials === 'loading') {
    return <i>Loading...</i>;
  }

  return credentials.map(({ name, displayName, value, comment }) => (
    <SettingsEntry
      title={displayName}
      actionHandler={() =>
        (value ? revokeCredential : requestNewCredential)(name)
      }
      actionTitle={value ? 'Revoke token' : 'Request token'}
      comment={comment}
      key={name}
    >
      {value ? (
        <TextField type="text" readOnly value={value} />
      ) : (
        <i>No token yet.</i>
      )}
    </SettingsEntry>
  ));
};

export default Credentials;
