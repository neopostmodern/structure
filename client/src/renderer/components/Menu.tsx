import styled, { css } from 'styled-components';
import { breakpointDesktop } from '../styles/constants';

export const Menu = styled.div<{
  direction?: 'vertical' | 'vertical-horizontal';
}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  ${({ direction }) =>
    direction === 'vertical-horizontal' &&
    css`
      @media (max-width: ${breakpointDesktop - 0.001}rem) {
        flex-direction: row;
        gap: 1rem;
        @media (max-width: 27rem) {
          gap: 0.5rem;
        }
        align-items: center;
        flex-wrap: wrap;
        button {
          align-self: unset;
        }
      }
    `}

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
  flex-basis: 22.5ch;
  @media (min-width: ${breakpointDesktop}rem) {
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
  @media (max-width: ${breakpointDesktop - 0.001}rem) {
    margin-left: auto;
  }
`;
