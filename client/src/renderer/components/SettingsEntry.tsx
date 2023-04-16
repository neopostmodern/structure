import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

export const SettingsTable = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.2em;
`;

export const SettingsTablePurpose = styled.div`
  width: 8em;
`;

export const SettingsTableValue = styled.div`
  flex-grow: 1;

  input {
    width: 100%;
  }
`;

export const SettingsTableAction = styled.div`
  width: 10em;
  text-align: right;
`;

export const SettingsTableComments = styled.div`
  font-size: small;
  color: gray;
  margin-bottom: 0.8rem;
`;

type SettingsEntryAction = {
  actionTitle: string;
  actionHandler: () => void;
  readOnly?: boolean;
};
type SettingsEntryProps = {
  title: string | JSX.Element;
  comment?: string | JSX.Element;
} & (SettingsEntryAction | {});

const SettingsEntry: React.FC<React.PropsWithChildren<SettingsEntryProps>> = ({
  title,
  comment,
  children,
  ...optionalProps
}) => (
  <>
    <SettingsTable>
      <SettingsTablePurpose>{title}</SettingsTablePurpose>
      <SettingsTableValue>{children}</SettingsTableValue>
      {'actionTitle' in optionalProps &&
        optionalProps.actionTitle &&
        !optionalProps.readOnly && (
          <SettingsTableAction>
            <Button
              variant="outlined"
              size="small"
              onClick={(): void => {
                optionalProps.actionHandler();
              }}
            >
              {optionalProps.actionTitle}
            </Button>
          </SettingsTableAction>
        )}
    </SettingsTable>

    <SettingsTableComments>{comment}</SettingsTableComments>
  </>
);

export default SettingsEntry;
