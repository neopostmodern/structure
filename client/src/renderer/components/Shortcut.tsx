import { Paper } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

const ShortcutContainer = styled(Paper).attrs({ variant: 'outlined' })`
  display: inline-block;
  padding: 0 0.3em;
  font-weight: bold;
  font-size: 95%;
`;

const Shortcut: FC<
  PropsWithChildren<{ ctrlOrCommand?: boolean; canHotkey?: boolean }>
> = ({ children, canHotkey, ctrlOrCommand }) => {
  let prefix;
  if (!canHotkey || process.env.TARGET !== 'web') {
    if (ctrlOrCommand) {
      if (navigator.platform?.startsWith('Mac')) {
        prefix = '⌘+';
      } else {
        prefix = 'Ctrl+';
      }
    }
  }
  return (
    <ShortcutContainer>
      {prefix}
      {children}
    </ShortcutContainer>
  );
};

export default Shortcut;
