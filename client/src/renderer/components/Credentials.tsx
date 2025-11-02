import { StructureTextField } from './formComponents'
import SettingsEntry from './SettingsEntry'

export type CredentialsOrLoading =
  | 'loading'
  | Array<{
      name: string
      displayName: string
      value: string | null | undefined
      comment?: string
    }>

const Credentials = ({
  credentials,
  revokeCredential,
  requestNewCredential,
}: {
  credentials: CredentialsOrLoading
  requestNewCredential: (name: string) => void
  revokeCredential: (name: string) => void
}) => {
  if (credentials === 'loading') {
    return <i>Loading...</i>
  }

  return (
    <>
      {credentials.map(({ name, displayName, value, comment }) => (
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
            <StructureTextField
              type='text'
              inputProps={{ readOnly: true }}
              value={value}
            />
          ) : (
            <i>No token yet.</i>
          )}
        </SettingsEntry>
      ))}
    </>
  )
}

export default Credentials
