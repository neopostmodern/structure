import React from 'react'
import styled from 'styled-components'

export const SettingsTable = styled.div`
  display: flex;
`

export const SettingsTablePurpose = styled.div`
  width: 8em;
`

export const SettingsTableValue = styled.div`
  flex-grow: 1;

  input {
    width: 100%;
  }
`

export const SettingsTableAction = styled.div`
  width: 10em;
  text-align: right;
`

export const SettingsTableComments = styled.div`
  font-size: small;
  color: gray;
`

interface SettingsEntryProps {
  title: string
  actionTitle: string
  actionHandler: () => void
  comment?: JSX.Element
}

const SettingsEntry: React.FC<SettingsEntryProps> = ({
  title,
  actionTitle,
  actionHandler,
  comment,
  children,
}) => (
  <SettingsTable>
    <SettingsTablePurpose>{title}</SettingsTablePurpose>
    <SettingsTableValue>{children}</SettingsTableValue>
    <SettingsTableAction>
      <button
        type='button'
        onClick={(): void => {
          actionHandler()
        }}
      >
        {actionTitle}
      </button>
    </SettingsTableAction>

    <SettingsTableComments>{comment}</SettingsTableComments>
  </SettingsTable>
)

export default SettingsEntry
