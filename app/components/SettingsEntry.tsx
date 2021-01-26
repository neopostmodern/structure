import React from 'react'
import styled from 'styled-components'
import { InlineButton } from './CommonStyles'

export const SettingsTable = styled.div`
  display: flex;
  margin-bottom: 0.2em;
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
  margin-bottom: 0.8rem;
`

type SettingsEntryAction = {
  actionTitle: string
  actionHandler: () => void
}
type SettingsEntryProps = {
  title: string | JSX.Element
  comment?: string | JSX.Element
} & (SettingsEntryAction | never)

const SettingsEntry: React.FC<SettingsEntryProps> = ({
  title,
  actionTitle,
  actionHandler,
  comment,
  children,
}) => (
  <>
    <SettingsTable>
      <SettingsTablePurpose>{title}</SettingsTablePurpose>
      <SettingsTableValue>{children}</SettingsTableValue>
      {actionTitle && (
        <SettingsTableAction>
          <InlineButton
            type='button'
            onClick={(): void => {
              actionHandler()
            }}
          >
            {actionTitle}
          </InlineButton>
        </SettingsTableAction>
      )}
    </SettingsTable>

    <SettingsTableComments>{comment}</SettingsTableComments>
  </>
)

export default SettingsEntry
