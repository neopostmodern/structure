import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { baseFont } from '../styles/constants';

const baseInteractiveElement = css`
  opacity: 0.75;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const baseLink = `
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

const baseTextFieldDecorations = css`
  color: inherit;
  background-color: transparent;

  &:hover {
    border-color: lightgray;
  }
  &:focus {
    border-color: ${({ theme }) => theme.palette.text.primary};
    outline: none;
  }
`;

export const TextField = styled.input`
  font-family: ${baseFont};

  width: 100%;

  outline: none;
  padding: 0.3em 0;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  &:placeholder-shown {
    border-bottom-color: lightgray;
  }

  ${baseTextFieldDecorations}
`;

export const TextArea = styled.textarea`
  border: 1px solid #eee;
  box-sizing: border-box;
  padding: 0.5em;

  ${baseTextFieldDecorations}
`;
