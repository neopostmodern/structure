import { Add, BackspaceOutlined as ClearIcon } from '@mui/icons-material';
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';
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
}) => (
  <Menu>
    <IconButton component={Link} to="/notes/add">
      <Add style={{ fontSize: '3rem' }} />
    </IconButton>
    <Button onClick={toggleLayout} size="huge">
      {layoutToName(layout)}
    </Button>
    <Button onClick={nextArchiveState} size="huge">
      {archiveStateToName(archiveState)}
    </Button>
    <MenuSearchFieldContainer>
      <FormControl variant="standard" sx={{ width: '100%' }}>
        <InputLabel>Filter</InputLabel>
        <Input
          onChange={({ target: { value } }): void => {
            onChangeSearchQuery(value);
          }}
          value={searchQuery}
          inputRef={searchInput}
          endAdornment={
            searchQuery.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear text search filter"
                  onClick={(): void => onChangeSearchQuery('')}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
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

export default NotesMenu;
