import { Box, Paper } from '@mui/material';
import styled, { css } from 'styled-components';
import {
  baseFont,
  breakpointDesktop,
  breakPointMobile,
  containerWidth,
} from '../styles/constants';

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
  @media (max-width: ${breakPointMobile}) {
    ${({ theme }) =>
      (
        Object.entries(theme.mixins.toolbar) as Array<
          [string, number | { minHeight: number }]
        >
      )
        .map(([key, value]): string => {
          let toolbarHeight = value;
          let mediaQuery;
          if (typeof value !== 'number') {
            mediaQuery = key;
            toolbarHeight = value.minHeight;
          }
          const paddingRule = `padding-bottom: calc(${toolbarHeight}px + ${theme.spacing(
            2
          )} + env(safe-area-inset-bottom));`;
          if (!mediaQuery) {
            return paddingRule;
          }
          return `${mediaQuery} { ${paddingRule} }`;
        })
        .join('\n')}
  }
`;

const cornerMaxWidth = css`calc(calc(100% - ${containerWidth}) / 2)`;
const Corner = styled.div`
  @media (min-width: ${breakpointDesktop}rem) {
    position: fixed;
    padding: ${({ theme }) => theme.spacing(2)};
    padding-top: ${({ theme }) => theme.spacing(4)};
    box-sizing: border-box;
    width: 100%;
    max-width: ${cornerMaxWidth};
  }
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

  padding-top: ${({ theme }) => theme.spacing(2)};

  @media (min-width: ${breakpointDesktop}rem) {
    ${({ wide }) =>
      !wide &&
      css`
        width: 55%;
      `}
    padding-top: ${({ theme }) => theme.spacing(4)};
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
