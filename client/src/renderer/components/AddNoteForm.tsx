import { ArrowForward, ContentPaste } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
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

const SubmitButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const isUrlValid = (url: string): boolean => url.startsWith('http');

type AddLinkFormProps = {
  defaultValue?: string;
  autoSubmit?: boolean;
  onSubmitUrl: (url: string) => void;
  onSubmitText: (title?: string) => void;
  onAbort: () => void;
};

const AddNoteForm: React.FC<AddLinkFormProps> = ({
  defaultValue,
  autoSubmit,
  onSubmitUrl,
  onSubmitText,
  onAbort,
}) => {
  const dispatch = useDispatch();
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
  }, [defaultValue, setValue, isUrlValid]);
  const submitHandler = handleSubmit(({ urlOrTitle }) => {
    if (isUrlValid(urlOrTitle)) {
      onSubmitUrl(urlOrTitle);
    } else {
      onSubmitText(urlOrTitle);
    }
  });

  useEffect(() => {
    if ('urlOrTitle' in formState.dirtyFields && autoSubmit) {
      submitHandler();
    }
  }, ['urlOrTitle' in formState.dirtyFields, autoSubmit]);

  useEffect(() => {
    dispatch(requestClipboard());
    return (): void => {
      dispatch(clearClipboard());
    };
  }, [dispatch]);
  const clipboard = useSelector<RootState, string | undefined>(
    (state) => state.userInterface.clipboard
  );
  useEffect(() => {
    if (clipboard && isUrlValid(clipboard)) {
      setValue('urlOrTitle', clipboard, { shouldDirty: true });
    }
  }, [clipboard, setValue, isUrlValid]);
  const handlePasteClick = useCallback(() => {
    (async () => {
      setValue('urlOrTitle', await navigator.clipboard.readText(), {
        shouldDirty: true,
      });
    })();
  }, [setValue]);

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
  } else if (navigator.clipboard.readText) {
    endAdornment = (
      <IconButton onClick={handlePasteClick}>
        <ContentPaste />
      </IconButton>
    );
  }

  return (
    <>
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
                    <InputAdornment position="end">
                      {endAdornment}
                    </InputAdornment>
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
      {!formState.isDirty && (
        <SubmitButtonContainer>
          <Button
            size="small"
            variant="outlined"
            onClick={() => {
              onSubmitText();
            }}
          >
            Quick text-only note
          </Button>
        </SubmitButtonContainer>
      )}
    </>
  );
};

export default AddNoteForm;
