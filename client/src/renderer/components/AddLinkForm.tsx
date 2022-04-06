import { ArrowForward, ContentPaste } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearClipboard, requestClipboard } from '../actions/userInterface';
import { RootState } from '../reducers';

const AddLinkInput = styled(Input)`
  input {
    font-size: 200%;
  }
`;

const isUrlValid = (url: string): boolean => url.startsWith('http');

type AddLinkFormProps = {
  defaultValue?: string;
  autoSubmit?: boolean;
  onSubmit: (url: string) => void;
  onAbort: () => void;
};

const AddLinkForm: React.FC<AddLinkFormProps> = ({
  defaultValue,
  autoSubmit,
  onSubmit,
  onAbort,
}) => {
  const dispatch = useDispatch();
  const { formState, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      uri: defaultValue || '',
    },
  });
  const submitHandler = handleSubmit(({ uri }) => {
    onSubmit(uri);
  });

  useEffect(() => {
    if (autoSubmit) {
      submitHandler();
    }
  }, [autoSubmit]);

  useEffect(() => {
    dispatch(requestClipboard());
    return (): void => {
      dispatch(clearClipboard());
    };
  }, [dispatch]);

  const clipboard = useSelector<RootState, string | undefined>(
    (state) => state.userInterface.clipboard
  );
  if (clipboard && isUrlValid(clipboard)) {
    setValue('uri', clipboard);
  }

  let endAdornment: JSX.Element | undefined;
  if (!Object.keys(formState.errors).length && formState.dirtyFields.uri) {
    endAdornment = (
      <IconButton
        onClick={() => {
          submitHandler();
        }}
      >
        <ArrowForward />
      </IconButton>
    );
  } else if (navigator.clipboard.readText) {
    endAdornment = (
      <IconButton
        onClick={() => {
          (async () => {
            setValue('uri', await navigator.clipboard.readText());
          })();
        }}
      >
        <ContentPaste />
      </IconButton>
    );
  }

  return (
    <div style={{ paddingTop: '20vh' }}>
      <form onSubmit={submitHandler}>
        <Controller
          name="uri"
          control={control}
          rules={{
            required: 'URL is required',
            validate: (value) =>
              isUrlValid(value) ||
              'Did you forget the protocol? (e.g. https://)',
          }}
          render={({ field }) => (
            <FormControl variant="standard" fullWidth>
              <AddLinkInput
                {...field}
                autoFocus
                type="text"
                placeholder="URL here"
                onKeyDown={(event): void => {
                  if (event.key === 'Escape') {
                    onAbort();
                  }
                }}
                endAdornment={
                  endAdornment ? (
                    <InputAdornment position="end">
                      {endAdornment}
                    </InputAdornment>
                  ) : undefined
                }
              />
              {formState.errors.uri && (
                <FormHelperText error>
                  {formState.errors.uri.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </form>
    </div>
  );
};

export default AddLinkForm;
