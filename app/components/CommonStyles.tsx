import styled from 'styled-components'

export const InlineButton = styled.button`
  padding: 0.2em 0.4em 0.1em;
`

export const TextButton = styled.button`
  margin-top: 1rem;
  border: none;
  padding: 0;

  &:focus,
  &:hover {
    outline: none;
    //text-decoration: underline;
    background-color: black;
    color: white;
  }
`
