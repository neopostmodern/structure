import styled from 'styled-components';
import { breakPointMobile } from '../styles/constants';
import { TextButton, TextField } from './CommonStyles';

const menuFontSize = '1.5rem';

export const Menu = styled.div`
  display: flex;
  flex-wrap: wrap;
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
`;

export const StickyMenu = styled(Menu)`
  position: sticky;
  top: 0;
  padding-top: 1em;
  padding-bottom: 0.3em;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const MenuSearchFieldContainer = styled.div`
  margin-left: auto;
  position: relative;

  @media (max-width: ${breakPointMobile}) {
    margin-left: 0;
    margin-top: 1.5rem;
    width: 100%;
  }
`;

export const MenuSearchField = styled(TextField)`
  font-size: ${menuFontSize};

  margin-top: -0.3em;
  padding-bottom: 3px;

  @media (min-width: ${breakPointMobile}) {
    width: 17rem;
  }
`;

export const MenuSearchFieldEraseButton = styled.button`
  font-size: ${menuFontSize};

  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
`;
