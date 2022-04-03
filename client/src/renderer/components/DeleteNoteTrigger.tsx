import { Delete as DeleteIcon } from '@mui/icons-material';
import TriggerWithConfirmation from './TriggerWithConfirmation';

const DeleteNoteTrigger = ({
  note,
  variant = 'button',
  loading,
  deleteNote,
}: {
  note: { name: string };
  variant?: 'button' | 'menuitem';
  loading: boolean;
  deleteNote: () => void;
}) => {
  return (
    <TriggerWithConfirmation
      variant={variant}
      startIcon={<DeleteIcon />}
      buttonProps={
        variant === 'button'
          ? {
              size: 'huge',
              type: 'button',
              loading: loading,
            }
          : undefined
      }
      onClick={(): void => {
        deleteNote();
      }}
      confirmationQuestion={`Are you sure you want to delete the note "${note.name}"?`}
      confirmationButtonLabel="Delete"
    >
      Delete note
    </TriggerWithConfirmation>
  );
};

export default DeleteNoteTrigger;
