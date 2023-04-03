import styled, { css } from 'styled-components';
import { TextField } from './CommonStyles';

export const NameInput = styled(TextField)`
  font-size: 2.5rem;
  padding-top: 0;
`;

export const FORM_SUBHEADER_STYLES = css`
  font-size: 80%;
  text-transform: uppercase;
  color: gray;
`;
export const FormSubheader = styled.div`
  ${FORM_SUBHEADER_STYLES}
  margin-top: 0.5em;
`;
