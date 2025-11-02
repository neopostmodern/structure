import { ScreenSearchDesktop } from '@mui/icons-material'
import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArchiveState,
  changeArchiveState,
  changeSearchQuery,
} from '../actions/userInterface'
import { RootState } from '../reducers'
import { UserInterfaceStateType } from '../reducers/userInterface'
import { SHORTCUTS } from '../utils/keyboard'
import EmptyPageInfo from './EmptyPageInfo'
import Shortcut from './Shortcut'

const NotesPageEmpty = ({
  archivedMatchedNotesCount,
}: {
  archivedMatchedNotesCount: number | undefined
}) => {
  const { archiveState, searchQuery } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface)
  const dispatch = useDispatch()

  return (
    <EmptyPageInfo
      icon={ScreenSearchDesktop}
      title='Nothing matches your search or filters.'
      subtitle={
        <>
          Did you know you can use{' '}
          <Shortcut shortcuts={SHORTCUTS.SEARCH} inline /> to focus the search
          field?
        </>
      }
      actions={
        <>
          {searchQuery && (
            <Button
              variant='outlined'
              onClick={() => dispatch(changeSearchQuery(''))}
            >
              Reset search
            </Button>
          )}
          {(archivedMatchedNotesCount || 0) > 0 && (
            <Button
              variant='outlined'
              onClick={() => dispatch(changeArchiveState(ArchiveState.BOTH))}
            >
              Include{' '}
              {archiveState === ArchiveState.NO_ARCHIVE
                ? 'archive'
                : 'not archived'}
            </Button>
          )}
        </>
      }
    ></EmptyPageInfo>
  )
}

export default NotesPageEmpty
