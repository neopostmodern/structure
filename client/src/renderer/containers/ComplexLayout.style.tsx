import styled, { css } from 'styled-components';
import { InternalLink } from '../components/CommonStyles';
import {
  baseFont,
  breakpointDesktop,
  breakPointMobile,
  containerWidth,
} from '../styles/constants';

const gutter = 1;

export const Container = styled.div`
  font-family: ${baseFont};
  @media (max-width: ${breakpointDesktop}rem) {
    display: flex;
    flex-direction: column;
  }
`;

const cornerMaxWidth = css`calc(calc(100% - ${containerWidth}) / 2)`;
const Corner = styled.div`
  @media (min-width: ${breakpointDesktop}rem) {
    position: fixed;
    padding: ${gutter}rem;
    box-sizing: border-box;
    width: 100%;
    max-width: ${cornerMaxWidth};
  }
`;

export const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`;
export const OfflineBanner = styled.div`
  background-color: gray;
  color: white;
  padding: 0.5em;
  text-align: center;
`;

export const Navigation = styled(Corner)`
  top: 0;
  left: 0;
`;

export const PrimaryContent = styled.div`
  width: 100%;
  max-width: ${containerWidth};
  margin: ${gutter}rem auto 5rem;
  order: 1;

  @media (max-width: ${breakPointMobile}) {
    margin-top: 0;
  }
`;

const Actions = styled(Corner)`
  @media (min-width: ${breakpointDesktop}rem) {
    padding-left: 3rem;
    max-width: min(${cornerMaxWidth}, 25rem);
  }
`;
export const PrimaryActions = styled(Actions)`
  right: 0;
  top: 0;
`;
export const SecondaryActions = styled(Actions)`
  right: 0;
  bottom: 0;
  order: 2;
`;
export const UserAndMenuIndicator = styled(Corner)`
  left: 0;
  bottom: 0;

  @media (max-width: ${breakpointDesktop}rem) {
    order: -1;
    margin-left: auto;
  }
`;

export const Title = styled.h1`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  margin: 0;

  font-size: 5rem;
  font-weight: bold;
  letter-spacing: -0.025em;

  @media (max-width: ${breakPointMobile}) {
    font-size: 15vw;
  }

  a {
    color: blue;
  }
`;

export const Username = styled(InternalLink)`
  color: black;
  opacity: 1;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
