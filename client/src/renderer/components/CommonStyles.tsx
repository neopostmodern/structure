import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { baseFont } from '../styles/constants';

const baseInteractiveElement = `
  opacity: 0.75;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

export const InlineButton = styled.button`
  font-family: ${baseFont};

  background: none;
  border: 1px solid black;
  cursor: pointer;

  padding: 0.2em 0.4em 0.1em;

  &:hover,
  &:active {
    background-color: #eee;
  }
`;

export const TextButton = styled.button`
  ${baseInteractiveElement}

  background: none;
  border: none;
  padding: 0;
  font: inherit;
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

const baseTextFieldDecorations = `
	&:hover {
		border-color: lightgray;
	}
	&:focus {
		border-color: black;
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
