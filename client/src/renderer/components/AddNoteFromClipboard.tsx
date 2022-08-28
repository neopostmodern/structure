import {
  ContentPaste,
  ContentPasteOff,
  ContentPasteSearch,
  Edit,
  Refresh,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FC, MouseEventHandler, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearClipboard, requestClipboard } from '../actions/userInterface';
import { AddTextMutationVariables } from '../generated/graphql';
import {
  CLIPBOARD_NOT_AVAILABLE,
  CLIPBOARD_NOT_GRANTED,
} from '../middleware/electron';
import { RootState } from '../reducers';
import { isUrlValid } from '../utils/textHelpers';
import AddNoteCard from './AddNoteCard';

const AddNoteFromClipboard: FC<{
  onEdit: (suggestion: string) => void;
  onSubmitText: (text: AddTextMutationVariables) => void;
  onSubmitUrl: (url: string) => void;
}> = ({ onEdit, onSubmitText, onSubmitUrl }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(requestClipboard());
    return (): void => {
      dispatch(clearClipboard());
    };
  }, [dispatch]);
  const clipboard = useSelector<RootState, string | undefined>(
    (state) => state.userInterface.clipboard
  );

  const handleEdit: MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      event.stopPropagation();
      onEdit(clipboard!);
      dispatch(clearClipboard());
    },
    [onEdit, clipboard]
  );

  if (clipboard === CLIPBOARD_NOT_GRANTED) {
    return (
      <AddNoteCard
        icon={<ContentPasteSearch />}
        title="Grant access to clipboard"
        subtitle="Give Structure permission to read your clipboard to quickly add notes"
        action={() => {
          (async () => {
            try {
              await navigator.clipboard.readText();
            } catch {
              alert('Clipboard permission denied.');
            }
            dispatch(requestClipboard());
          })();
        }}
      />
    );
  }

  if (clipboard === CLIPBOARD_NOT_AVAILABLE) {
    return null;
  }

  const refreshButton = (
    <IconButton
      onClick={(event) => {
        event.stopPropagation();
        dispatch(requestClipboard());
      }}
    >
      <Refresh />
    </IconButton>
  );

  if (!clipboard) {
    return (
      <AddNoteCard
        title=""
        subtitle="Clipboard is empty"
        icon={<ContentPasteOff />}
        additionalActions={refreshButton}
      />
    );
  }

  const isUrl = isUrlValid(clipboard);
  const isShort = clipboard.length < 100;

  let action;
  let actions;
  if (isUrl) {
    action = () => {
      onSubmitUrl(clipboard);
    };
  } else if (isShort) {
    actions = {
      'Add as title': () => onSubmitText({ title: clipboard }),
      'Add as content': () => onSubmitText({ description: clipboard }),
    };
  } else {
    action = () => {
      onSubmitText({ description: clipboard });
    };
  }

  return (
    <AddNoteCard
      icon={<ContentPaste />}
      title={`Add ${isUrl ? 'URL' : 'text note'} from clipboard`}
      suggestion={clipboard}
      action={action}
      actions={actions}
      additionalActions={
        <>
          {refreshButton}
          {isShort ? (
            <IconButton onClick={handleEdit}>
              <Edit />
            </IconButton>
          ) : undefined}
        </>
      }
    />
  );
};

export default AddNoteFromClipboard;
