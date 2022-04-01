import { gql, useQuery } from '@apollo/client';
import {
  History as HistoryIcon,
  HistoryToggleOff as HistoryLoadingIcon,
} from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { VisitedNotes } from '../generated/VisitedNotes';
import { RootState } from '../reducers';
import { NoteSummary } from '../reducers/history';

const VISITED_NOTES_QUERY = gql`
  query VisitedNotes {
    notes {
      ... on INote {
        _id
        name
      }
    }
  }
`;

const menuId = 'last-visited-notes-popup';

const LastVisitedNotes = () => {
  const [menuAnchorElement, setMenuAnchorElement] =
    useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorElement);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchorElement(null);
  };

  const lastVisitedNotes = useSelector<RootState, Array<NoteSummary>>(
    (state) => state.history.lastVisitedNotes
  );

  const notesQuery = useQuery<VisitedNotes>(VISITED_NOTES_QUERY, {
    fetchPolicy: 'cache-only',
  });

  const dispatch = useDispatch();

  return (
    <div>
      <Tooltip title="Recently viewed notes">
        <IconButton
          aria-controls={menuOpen ? menuId : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          onClick={handleClick}
          disabled={lastVisitedNotes.length === 0 || notesQuery.loading}
        >
          {notesQuery.loading ? <HistoryLoadingIcon /> : <HistoryIcon />}
        </IconButton>
      </Tooltip>
      <Menu
        id={menuId}
        anchorEl={menuAnchorElement}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {lastVisitedNotes.map(({ type, id }) => (
          <MenuItem
            key={id}
            onClick={() => {
              dispatch(push(`/${type}s/${id}`));
              handleClose();
            }}
          >
            {notesQuery.data?.notes?.find((note) => note?._id === id)?.name ||
              id}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LastVisitedNotes;
