import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

const baseInteractiveElement = css`
  opacity: 0.75;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const baseLink = css`
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }
`;

export const InternalLink = styled(Link)`
  ${baseInteractiveElement}
  ${baseLink}
`;

// todo: move noreferrer etc here / to a component
export const ExternalLink = styled.a`
  ${baseInteractiveElement}
  ${baseLink}
`;
