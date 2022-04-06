import styled from 'styled-components';
import { breakpointDesktop } from '../styles/constants';

const Gap = styled.div<{
  horizontal?: string | number;
  vertical?: string | number;
  visibility?: 'always' | 'desktop-up' | 'below-desktop';
}>`
  @media all ${({ visibility = 'always ' }) => {
      if (visibility === 'below-desktop') {
        return `and (max-width: ${breakpointDesktop - 0.001}rem)`;
      }
      if (visibility === 'desktop-up') {
        return `and (min-width: ${breakpointDesktop}rem)`;
      }
      return '';
    }} {
    ${({ horizontal }) =>
      horizontal !== undefined &&
      `width: ${
        typeof horizontal === 'string' ? horizontal : `${horizontal}rem`
      }`}
    ${({ vertical }) =>
      vertical !== undefined &&
      `height: ${typeof vertical === 'string' ? vertical : `${vertical}rem`}`}
  }
`;

export default Gap;
