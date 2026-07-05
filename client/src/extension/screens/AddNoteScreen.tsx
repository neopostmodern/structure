import { ErrorLike } from '@apollo/client'
import { Button } from '@mui/material'
import { FC } from 'react'
import Centered from '../../renderer/components/Centered'
import ErrorSnackbar from '../../renderer/components/ErrorSnackbar'
import Gap from '../../renderer/components/Gap'
import { SmallGrayText } from '../../renderer/components/util'
import type { NotesForSortAndFilterQuery } from '../../renderer/generated/graphql'
import { LazyPolicedData } from '../../renderer/utils/useDataState'
import PopupLayout from '../PopupLayout'
import { SimilarNotes } from '../components/SimilarNotes'

const AddNoteScreen: FC<{
  isAdding: boolean
  addError: ErrorLike | undefined
  onAdd: () => void
  similarNotes: LazyPolicedData<NotesForSortAndFilterQuery['notes']>
  url: string | undefined
  linkNoteId: (noteId: string) => void
}> = ({ isAdding, addError, onAdd, similarNotes, url, linkNoteId }) => (
  <PopupLayout>
    <ErrorSnackbar error={addError} actionDescription='add note' />

    <Centered height='5rem'>
      <Button
        variant='outlined'
        size='large'
        onClick={onAdd}
        disabled={isAdding}
      >
        {isAdding ? 'Adding…' : 'Add as a new note'}
      </Button>
    </Centered>
    <SmallGrayText capitalize={true}>Current URL</SmallGrayText>
    <SmallGrayText>{url}</SmallGrayText>
    <Gap vertical={2} />
    <SimilarNotes
      notes={similarNotes}
      referenceUrl={url}
      linkNoteId={linkNoteId}
    />
  </PopupLayout>
)

export default AddNoteScreen
