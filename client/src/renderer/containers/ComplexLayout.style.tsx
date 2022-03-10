import { Box, Paper } from '@mui/material';
import styled, { css } from 'styled-components';
import { InternalLink } from '../components/CommonStyles';
import {
  baseFont,
  breakpointDesktop,
  breakPointMobile,
  containerWidth,
} from '../styles/constants';

const gutter = 1;

export const Container = styled(Paper).attrs(() => ({
  square: true,
}))`
  font-family: ${baseFont};
  min-height: 100vh;
  box-sizing: border-box;
  @media (max-width: ${breakpointDesktop - 0.001}rem) {
    padding: ${({ theme }) => theme.spacing(2)};
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

export const PrimaryContent = styled(Box)<{ wide?: boolean }>`
  width: 100%;
  ${({ wide }) =>
    !wide &&
    css`
      max-width: ${containerWidth};
    `}

  margin: 0 auto;
  order: 1;

  @media (max-width: ${breakPointMobile}) {
    padding-top: 0;
  }
  @media (min-width: ${breakpointDesktop}rem) {
    width: 55%;
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
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

  @media (max-width: ${breakpointDesktop - 0.001}rem) {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;
export const SecondaryActions = styled(Actions)`
  right: 0;
  bottom: 0;
  order: 2;

  @media (max-width: ${breakpointDesktop - 0.001}rem) {
    margin-top: auto;
  }
`;
export const UserAndMenuIndicator = styled(Corner)`
  left: 0;
  bottom: 0;

  @media (max-width: ${breakpointDesktop - 0.001}rem) {
    order: -1;
    margin-left: auto;
  }
`;

export const Username = styled(InternalLink)`
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 1;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;
