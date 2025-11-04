import { FilterAlt, List, Sort, ViewList } from '@mui/icons-material'
import { Ref, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArchiveState,
  changeArchiveState,
  changeLinkLayout,
  changeSortBy,
  LinkLayout,
  SortBy,
} from '../actions/userInterface'
import { RootState } from '../reducers'
import {
  DEFAULT_ARCHIVE_STATE,
  DEFAULT_SORT_BY,
  UserInterfaceStateType,
} from '../reducers/userInterface'
import {
  archiveStateToName,
  layoutToName,
  sortByToName,
} from '../utils/textHelpers'
import { Menu, MenuSearchFieldContainer } from './Menu'
import NotesMenuButton from './NotesMenuButton'
import { SearchField } from './SearchField'

interface NotesMenuProps {
  noteCountsWithSearchMatchesString: string | null
  searchInputRef: Ref<HTMLInputElement>
}

const NotesMenu = ({
  searchInputRef,
  noteCountsWithSearchMatchesString,
}: NotesMenuProps) => {
  const {
    linkLayout: layout,
    archiveState,
    sortBy,
  } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface,
  )

  const dispatch = useDispatch()

  const handleChangeLayout = useCallback(
    (newLayout: LinkLayout): void => {
      dispatch(changeLinkLayout(newLayout))
    },
    [dispatch],
  )

  const handleChangeArchiveState = useCallback(
    (newArchiveState: ArchiveState): void => {
      dispatch(changeArchiveState(newArchiveState))
    },
    [dispatch],
  )

  const handleChangeSortBy = useCallback(
    (newSortBy: SortBy) => {
      dispatch(changeSortBy(newSortBy))
    },
    [dispatch],
  )

  return (
    <Menu direction='vertical-horizontal' style={{ marginTop: '-12px' }}>
      <NotesMenuButton
        icons={[<List />, <ViewList />]}
        options={Object.values(LinkLayout)}
        optionToName={layoutToName}
        onSelectOption={handleChangeLayout}
        value={layout}
      />
      <NotesMenuButton
        icon={<FilterAlt />}
        options={Object.values(ArchiveState)}
        optionToName={archiveStateToName}
        onSelectOption={handleChangeArchiveState}
        value={archiveState}
        defaultValue={DEFAULT_ARCHIVE_STATE}
      />
      <NotesMenuButton
        icon={<Sort />}
        options={Object.values(SortBy)}
        optionToName={sortByToName}
        onSelectOption={handleChangeSortBy}
        value={sortBy}
        defaultValue={DEFAULT_SORT_BY}
      />
      <MenuSearchFieldContainer>
        <SearchField
          inputRef={searchInputRef}
          noteCountsWithSearchMatchesString={noteCountsWithSearchMatchesString}
        />
      </MenuSearchFieldContainer>
    </Menu>
  )
}

export default NotesMenu
