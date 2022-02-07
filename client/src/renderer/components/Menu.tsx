import styled from 'styled-components';
import { breakpointDesktop } from '../styles/constants';

const menuFontSize = '1.5rem';

export const Menu = styled.div`
  display: flex;
  @media (min-width: ${breakpointDesktop}rem) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (max-width: ${breakpointDesktop}rem) {
    align-items: center;
    flex-wrap: wrap;
    button {
      align-self: unset;
    }
  }

  font-size: ${menuFontSize};

  a,
  button {
    &:disabled,
    &.disabled {
      text-decoration: line-through;
      color: gray;
      cursor: default;
    }
  }
`;

export const StickyMenu = styled(Menu)`
  position: sticky;
  top: 0;
  padding-top: 1em;
  padding-bottom: 0.3em;
  background-color: rgba(255, 255, 255, 0.8);
`;

export const MenuSearchFieldContainer = styled.div`
  flex-basis: 15ch;
  @media (min-width: ${breakpointDesktop}rem) {
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
  @media (max-width: ${breakpointDesktop}rem) {
    margin-left: auto;
  }
`;
