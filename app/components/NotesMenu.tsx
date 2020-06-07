import React from 'react'
import { Link } from 'react-router-dom'

import { archiveStateToName, layoutToName } from '../utils/textHelpers'
import NoteCount from '../containers/NotesPage/NoteCount'
import {
  Menu,
  MenuSearchField,
  MenuSearchFieldContainer,
  MenuSearchFieldEraseButton,
} from './Menu'

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
}) => (
  <Menu>
    <Link to='/notes/add'>Add new</Link>
    ,&nbsp;
    <a onClick={toggleLayout}>{layoutToName(layout)}</a>
    ,&nbsp;
    <a onClick={nextArchiveState}>{archiveStateToName(archiveState)}</a>
    <MenuSearchFieldContainer>
      <MenuSearchField
        type='text'
        placeholder='Filter'
        onChange={({ target: { value } }): void => {
          onChangeSearchQuery(value)
        }}
        value={searchQuery}
      />
      {searchQuery.length > 0 ? (
        <MenuSearchFieldEraseButton
          type='button'
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
)

export default NotesMenu
