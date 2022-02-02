import styled from 'styled-components';
import { breakpointDesktop } from '../styles/constants';
import { TextButton, TextField } from './CommonStyles';

const menuFontSize = '1.5rem';

export const Menu = styled.div`
  display: flex;
  @media (min-width: ${breakpointDesktop}rem) {
    flex-direction: column;
  }
  @media (max-width: ${breakpointDesktop}rem) {
    align-items: baseline;
    flex-wrap: wrap;
    button {
      align-self: unset;
    }
  }

  font-size: ${menuFontSize};

  a,
  button {
    color: black;
    border: none;
    background: none;

    &:disabled,
    &.disabled {
      text-decoration: line-through;
      color: gray;
      cursor: default;
    }
  }
`;

export const MenuButton = styled(TextButton)`
  align-self: flex-start;
  padding: 0.3em 1em 0.3em 0;
`;

export const StickyMenu = styled(Menu)`
  position: sticky;
  top: 0;
  padding-top: 1em;
  padding-bottom: 0.3em;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const MenuSearchFieldContainer = styled.div`
  position: relative;

  @media (max-width: ${breakpointDesktop}rem) {
    margin-top: 1.5rem;
    margin-left: auto;
  }
`;

export const MenuSearchField = styled(TextField)`
  font-size: ${menuFontSize};

  margin-top: -0.3em;
  padding-bottom: 3px;
`;

export const MenuSearchFieldEraseButton = styled.button`
  font-size: ${menuFontSize};

  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
`;
