import { ArrowForward } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import type { AddTextMutationVariables } from '../generated/graphql';
import { isUrlValid } from '../utils/textHelpers';

const AddLinkInput = styled(Input)`
  input {
    font-size: 200%;
  }
`;

const SubmitButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

type AddLinkFormProps = {
  defaultValue?: string;
  onSubmitUrl: (url: string) => void;
  onSubmitText: (textVariables: AddTextMutationVariables) => void;
  onAbort: () => void;
};

const AddNoteForm: React.FC<AddLinkFormProps> = ({
  defaultValue,
  onSubmitUrl,
  onSubmitText,
  onAbort,
}) => {
  const { formState, handleSubmit, setValue, control } = useForm<{
    urlOrTitle: string;
  }>({
    defaultValues: {
      urlOrTitle: '',
    },
  });
  useEffect(() => {
    if (defaultValue) {
      setValue('urlOrTitle', defaultValue, { shouldDirty: true });
    }
  }, [defaultValue, setValue]);
  const submitHandler = handleSubmit(({ urlOrTitle }) => {
    if (isUrlValid(urlOrTitle)) {
      onSubmitUrl(urlOrTitle);
    } else {
      onSubmitText({ title: urlOrTitle });
    }
  });

  let endAdornment: JSX.Element | undefined;
  if (
    !Object.keys(formState.errors).length &&
    formState.dirtyFields.urlOrTitle
  ) {
    endAdornment = (
      <IconButton
        onClick={() => {
          submitHandler();
        }}
      >
        <ArrowForward />
      </IconButton>
    );
  }

  return (
    <form onSubmit={submitHandler}>
      <Controller
        name="urlOrTitle"
        control={control}
        rules={{
          required: 'URL or title is required',
        }}
        render={({ field }) => (
          <FormControl variant="standard" fullWidth>
            <AddLinkInput
              {...field}
              autoFocus
              inputProps={{
                autocomplete: 'off',
              }}
              type="text"
              placeholder="Enter URL or text note title"
              onKeyDown={(event): void => {
                if (event.key === 'Escape') {
                  onAbort();
                }
              }}
              endAdornment={
                endAdornment ? (
                  <InputAdornment position="end">{endAdornment}</InputAdornment>
                ) : undefined
              }
            />
            {formState.errors.urlOrTitle && (
              <FormHelperText error>
                {formState.errors.urlOrTitle.message}
              </FormHelperText>
            )}
          </FormControl>
        )}
      />
    </form>
  );
};

export default AddNoteForm;
