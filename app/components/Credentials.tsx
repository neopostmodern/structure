import React from 'react'

import SettingsEntry from './SettingsEntry'
import { TextField } from './CommonStyles'

const Credentials = ({
  credentials,
  revokeCredential,
  requestNewCredential,
}) => {
  if (credentials === 'loading') {
    return <i>Loading...</i>
  }

  return credentials.map(({ name, displayName, purpose, value, comment }) => (
    <SettingsEntry
      title={displayName}
      actionHandler={() =>
        (value ? revokeCredential : requestNewCredential)(purpose)
      }
      actionTitle={value ? 'Revoke token' : 'Request token'}
      comment={comment}
      key={name}
    >
      {value ? (
        <TextField type='text' readOnly value={value} />
      ) : (
        <i>No token yet.</i>
      )}
    </SettingsEntry>
  ))
}

export default Credentials
