import { TextField, TextFieldProps } from '@mui/material'
import styled, { css } from 'styled-components'

export const FORM_SUBHEADER_STYLES = css`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: gray;
`

export const StructureTextField = styled(TextField).attrs({
  variant: 'standard',
  fullWidth: true,
})<TextFieldProps>`
  > ::before {
    border-bottom-color: transparent;
  }

  .MuiInputLabel-root {
    ${FORM_SUBHEADER_STYLES}
    font-size: 1.07rem; // 0.8rem / 0.75 scale
  }
  .MuiInputBase-readOnly:after,
  .MuiInputBase-readOnly:before {
    border-bottom-color: transparent !important;
  }
`

export const NameInput = styled(StructureTextField)`
  .MuiInputBase-input {
    font-size: ${({ theme }) => theme.typography.h2.fontSize};
  }
  .MuiInputLabel-root[data-shrink='false'] {
    font-size: ${({ theme }) => theme.typography.h2.fontSize};
  }
`

export const FormSubheader = styled.div`
  ${FORM_SUBHEADER_STYLES}
  margin-top: 0.5em;
`
