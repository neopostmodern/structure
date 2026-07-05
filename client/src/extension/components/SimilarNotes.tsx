import { List, ListItemButton, ListItemText } from '@mui/material'
import { SmallGrayText } from '../../renderer/components/util'
import type { NotesForSortAndFilterQuery } from '../../renderer/generated/graphql'
import { DataState, LazyPolicedData } from '../../renderer/utils/useDataState'
import { UrlDiff } from './UrlDiff'

export const SimilarNotes = ({
  notes,
  referenceUrl,
  linkNoteId,
}: {
  notes: LazyPolicedData<NotesForSortAndFilterQuery['notes']>
  referenceUrl: string | undefined
  linkNoteId: (noteId: string) => void
}) => {
  if (notes.state === DataState.UNCALLED) {
    return null
  }

  let content
  if (notes.state === DataState.LOADING) {
    content = <i>Searching for similar notes...</i>
  } else if (notes.state === DataState.ERROR) {
    content = <i>Failed to search for similar notes...</i>
  } else {
    if (notes.data.length === 0) {
      return <SmallGrayText>No similar previous notes found.</SmallGrayText>
    }

    content = (
      <List sx={{ marginLeft: '-1rem', marginRight: '-1rem' }}>
        {notes.data.map((note) => (
          <ListItemButton key={note._id} onClick={() => linkNoteId(note._id)}>
            <ListItemText
              primary={note.name}
              secondary={
                <UrlDiff url={note.url!} referenceUrl={referenceUrl} />
              }
            />
          </ListItemButton>
        ))}
      </List>
    )
  }

  return (
    <>
      <SmallGrayText capitalize={true}>Similar notes</SmallGrayText>
      {content}
    </>
  )
}
