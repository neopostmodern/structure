import styled from 'styled-components';
import { TextArea, TextField } from './CommonStyles';

export const NameInput = styled(TextField)`
  margin-bottom: 1rem;
  padding-bottom: 0.1em;
  font-size: 200%;
`;

export const DescriptionTextarea = styled(TextArea)`
  width: 100%;
  height: 20vh;
`;

export const FormSubheader = styled.div`
  font-size: 80%;
  text-transform: uppercase;
  color: gray;
  margin-top: 0.5em;
`;
