import { Add } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import NoteCount from '../containers/NotesPage/NoteCount';
import { archiveStateToName, layoutToName } from '../utils/textHelpers';
import {
  Menu,
  MenuSearchField,
  MenuSearchFieldContainer,
  MenuSearchFieldEraseButton,
} from './Menu';

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
    <MenuSearchFieldContainer style={{ marginTop: '1rem' }}>
      <MenuSearchField
        type="text"
        placeholder="Filter"
        onChange={({ target: { value } }): void => {
          onChangeSearchQuery(value);
        }}
        value={searchQuery}
        ref={searchInput}
      />
      {searchQuery.length > 0 ? (
        <MenuSearchFieldEraseButton
          type="button"
          onClick={(): void => onChangeSearchQuery('')}
        >
          ⌫
        </MenuSearchFieldEraseButton>
      ) : null}
      <div style={{ textAlign: 'right', fontSize: '50%', marginTop: '0.3em' }}>
        <NoteCount
          notes={notes}
          matchedNotes={matchedNotes}
          archiveState={archiveState}
          archivedMatchedNotesCount={archivedMatchedNotesCount}
        />
      </div>
    </MenuSearchFieldContainer>
  </Menu>
);

export default NotesMenu;
