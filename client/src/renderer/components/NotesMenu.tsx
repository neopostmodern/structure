import React from 'react';
import NoteCount from '../containers/NotesPage/NoteCount';
import { archiveStateToName, layoutToName } from '../utils/textHelpers';
import { InternalLink } from './CommonStyles';
import {
  Menu,
  MenuButton,
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
    <InternalLink to="/notes/add" style={{ paddingRight: '1em' }}>
      Add new
    </InternalLink>
    <MenuButton type="button" onClick={toggleLayout}>
      {layoutToName(layout)}
    </MenuButton>
    <MenuButton onClick={nextArchiveState}>
      {archiveStateToName(archiveState)}
    </MenuButton>
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
