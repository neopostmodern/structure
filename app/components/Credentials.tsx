import React from 'react'

import SettingsEntry from './SettingsEntry'

const Credentials = ({
  credentials,
  revokeCredential,
  requestNewCredential,
}) => {
  if (credentials === 'loading') {
    return <i>Loading...</i>
  }

  return credentials.map(({ displayName, purpose, value }) => (
    <SettingsEntry
      title={displayName}
      actionHandler={() =>
        (value ? revokeCredential : requestNewCredential)(purpose)
      }
      actionTitle={value ? 'Revoke token' : 'Request token'}
    >
      {value ? (
        <input type='text' readOnly value={value} />
      ) : (
        <i>No token yet.</i>
      )}
    </SettingsEntry>
  ))
}

export default Credentials
