import { Delete as DeleteIcon } from '@mui/icons-material';
import TriggerWithConfirmation from './TriggerWithConfirmation';

const DeleteTagTrigger = ({
  tag,
  variant = 'button',
  loading,
  deleteNote,
}: {
  tag: { name: string; notes: Array<unknown> };
  variant?: 'button' | 'menuitem';
  loading: boolean;
  deleteNote: () => void;
}) => {
  return (
    <TriggerWithConfirmation
      variant={variant}
      startIcon={<DeleteIcon />}
      loading={loading}
      modalInterstitial
      onClick={(): void => {
        deleteNote();
      }}
      confirmationQuestion={`Are you sure you want to delete the tag "${tag.name}"? It will be removed from ${tag.notes.length} notes. Deleting a tag cannot be undone.`}
      confirmationButtonLabel="Delete"
    >
      Delete tag
    </TriggerWithConfirmation>
  );
};

export default DeleteTagTrigger;
