import {
  BackspaceOutlined as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { useCallback } from 'react';
import NoteCount from '../containers/NotesPage/NoteCount';
import { archiveStateToName, layoutToName } from '../utils/textHelpers';
import { Menu, MenuSearchFieldContainer } from './Menu';

const NotesMenu = ({
  notes,
  toggleLayout,
  archiveState,
  nextArchiveState,
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
    <Menu direction="vertical-horizontal">
      <Button onClick={toggleLayout} size="huge">
        {layoutToName(layout)}
      </Button>
      <Button onClick={nextArchiveState} size="huge">
        {archiveStateToName(archiveState)}
      </Button>
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
