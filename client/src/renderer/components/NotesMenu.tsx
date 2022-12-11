import {
  BackspaceOutlined as ClearIcon,
  FilterAlt,
  List,
  Search as SearchIcon,
  Sort,
  ViewList,
} from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { Ref, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArchiveState,
  changeArchiveState,
  changeLinkLayout,
  changeSearchQuery,
  changeSortBy,
  LinkLayout,
  SortBy,
} from '../actions/userInterface';
import NoteCount from '../containers/NotesPage/NoteCount';
import { NotesForListQuery } from '../generated/graphql';
import { RootState } from '../reducers';
import {
  DEFAULT_ARCHIVE_STATE,
  DEFAULT_SORT_BY,
  UserInterfaceStateType,
} from '../reducers/userInterface';
import {
  archiveStateToName,
  layoutToName,
  sortByToName,
} from '../utils/textHelpers';
import { Menu, MenuSearchFieldContainer } from './Menu';
import NotesMenuButton from './NotesMenuButton';

interface NotesMenuProps {
  notes: NotesForListQuery['notes'];
  matchedNotes: NotesForListQuery['notes'];
  archivedMatchedNotesCount: number | undefined;
  searchInput: Ref<HTMLInputElement>;
}

const NotesMenu = ({
  notes,
  matchedNotes,
  archivedMatchedNotesCount,
  searchInput,
}: NotesMenuProps) => {
  const {
    linkLayout: layout,
    archiveState,
    sortBy,
    searchQuery,
  } = useSelector<RootState, UserInterfaceStateType>(
    (state) => state.userInterface
  );

  const dispatch = useDispatch();

  const onChangeSearchQuery = useCallback(
    (value: string): void => {
      dispatch(changeSearchQuery(value));
    },
    [dispatch]
  );
  const handleClearSearchText = useCallback(
    (): void => onChangeSearchQuery(''),
    [onChangeSearchQuery]
  );

  const handleChangeLayout = useCallback(
    (newLayout: LinkLayout): void => {
      dispatch(changeLinkLayout(newLayout));
    },
    [dispatch]
  );

  const handleChangeArchiveState = useCallback(
    (newArchiveState: ArchiveState): void => {
      dispatch(changeArchiveState(newArchiveState));
    },
    [dispatch]
  );

  const handleChangeSortBy = useCallback(
    (newSortBy: SortBy) => {
      dispatch(changeSortBy(newSortBy));
    },
    [dispatch]
  );

  return (
    <Menu direction="vertical-horizontal" style={{ marginTop: '-12px' }}>
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
        <FormControl variant="standard" sx={{ width: '100%' }}>
          <InputLabel>Search</InputLabel>
          <Input
            onChange={({ target: { value } }): void => {
              onChangeSearchQuery(value);
            }}
            value={searchQuery}
            inputRef={searchInput}
            endAdornment={
              <InputAdornment position="end">
                {searchQuery.length > 0 ? (
                  <IconButton
                    aria-label="clear text search filter"
                    onClick={handleClearSearchText}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            }
          />
          <FormHelperText sx={{ textAlign: 'right' }}>
            <NoteCount
              notes={notes}
              matchedNotes={matchedNotes}
              archiveState={archiveState}
              archivedMatchedNotesCount={archivedMatchedNotesCount}
            />
          </FormHelperText>
        </FormControl>
      </MenuSearchFieldContainer>
    </Menu>
  );
};

export default NotesMenu;
