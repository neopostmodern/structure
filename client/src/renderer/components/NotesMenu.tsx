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
import { useCallback } from 'react';
import { ArchiveState, LinkLayout, SortBy } from '../actions/userInterface';
import NoteCount from '../containers/NotesPage/NoteCount';
import {
  DEFAULT_ARCHIVE_STATE,
  DEFAULT_SORT_BY,
} from '../reducers/userInterface';
import {
  archiveStateToName,
  layoutToName,
  sortByToName,
} from '../utils/textHelpers';
import { Menu, MenuSearchFieldContainer } from './Menu';
import NotesMenuButton from './NotesMenuButton';

const NotesMenu = ({
  notes,
  updateLayout,
  archiveState,
  updateArchiveState,
  sortBy,
  updateSortBy,
  layout,
  searchQuery,
  onChangeSearchQuery,
  matchedNotes,
  archivedMatchedNotesCount,
  searchInput,
}) => {
  const handleClearSearchText = useCallback(
    (): void => onChangeSearchQuery(''),
    [onChangeSearchQuery]
  );

  return (
    <Menu direction="vertical-horizontal" style={{ marginTop: '-12px' }}>
      <NotesMenuButton
        icons={[<List />, <ViewList />]}
        options={Object.values(LinkLayout)}
        optionToName={layoutToName}
        onSelectOption={updateLayout}
        value={layout}
      />
      <NotesMenuButton
        icon={<FilterAlt />}
        options={Object.values(ArchiveState)}
        optionToName={archiveStateToName}
        onSelectOption={updateArchiveState}
        value={archiveState}
        defaultValue={DEFAULT_ARCHIVE_STATE}
      />
      <NotesMenuButton
        icon={<Sort />}
        options={Object.values(SortBy)}
        optionToName={sortByToName}
        onSelectOption={updateSortBy}
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
