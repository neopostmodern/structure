import { gql, useQuery } from '@apollo/client';
import {
  History as HistoryIcon,
  HistoryToggleOff as HistoryLoadingIcon,
} from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { MouseEvent, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { VisitedNotesQuery } from '../generated/graphql';
import useShortcut from '../hooks/useShortcut';
import { RootState } from '../reducers';
import { NoteSummary } from '../reducers/history';
import { SHORTCUTS } from '../utils/keyboard';
import { noteUrl } from '../utils/routes';

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

const MENU_ID = 'last-visited-notes-popup';
const MENU_ITEM_PREFIX = 'last-visited-item';
const menuItemId = (index: number): string => `${MENU_ITEM_PREFIX}_${index}`;

const getActiveMenuItemIndex = (): number | null => {
  const activeElementId = document.activeElement?.id || '';
  return activeElementId.startsWith(MENU_ITEM_PREFIX)
    ? parseInt(activeElementId.split('_')[1], 10)
    : null;
};

let firstShortCutActivation = {
  current: true,
};

const LastVisitedNotes = () => {
  const menuAnchorRef = useRef();
  const [menuAnchorElement, setMenuAnchorElement] =
    useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorElement);
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      setMenuAnchorElement(event.currentTarget);
    },
    [setMenuAnchorElement]
  );
  const handleClose = useCallback(() => {
    setMenuAnchorElement(null);
  }, [setMenuAnchorElement]);

  const lastVisitedNotes = useSelector<RootState, Array<NoteSummary>>(
    (state) => state.history.lastVisitedNotes
  );

  const notesQuery = useQuery<VisitedNotesQuery>(VISITED_NOTES_QUERY, {
    fetchPolicy: 'cache-only',
  });

  const dispatch = useDispatch();
  const navigateToNote = ({ type: __typename, id: _id }: NoteSummary) =>
    dispatch(push(noteUrl({ __typename, _id })));

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        let notedIndex = getActiveMenuItemIndex();
        if (notedIndex !== null) {
          navigateToNote(lastVisitedNotes[notedIndex]);
        }
        setMenuAnchorElement(null);
        window.removeEventListener('keyup', handleKeyUp);
        firstShortCutActivation.current = true;
      }
    },
    [setMenuAnchorElement, lastVisitedNotes]
  );

  useShortcut(SHORTCUTS.QUICK_NAVIGATION, () => {
    if (!menuAnchorRef.current || lastVisitedNotes.length === 0) {
      return;
    }

    if (firstShortCutActivation) {
      window.addEventListener('keyup', handleKeyUp);
      setMenuAnchorElement(menuAnchorRef.current);
    }

    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    const elementTimer = setTimeout(() => {
      /*
      - get the currently focused menu item index via document.active
      - when the menu pops open defaults to 0, although invisible
      - if it's the first keypress *and* the user is not on a note page (i.e.
        note 0 is not the current one) then subtract 1 so that with the +1 below
        the user ends up the last viewed note (0)
       */
      const currentFocusIndex =
        (getActiveMenuItemIndex() || 0) +
        (!window.location.href.includes('/links/') &&
        !window.location.href.includes('/texts/') &&
        firstShortCutActivation.current
          ? -1
          : 0);

      firstShortCutActivation.current = false;

      const nextMenuItemIndex =
        (currentFocusIndex + 1) % lastVisitedNotes.length;
      const menuItem = document.getElementById(menuItemId(nextMenuItemIndex));

      if (!menuItem) {
        console.error(
          `[LastVisitedNotes.useShortcut] No such HTML element: #${menuItemId(
            nextMenuItemIndex
          )}`
        );
        return;
      }
      focusTimer = setTimeout(() => {
        menuItem.focus();
      }, 10);
    }, 10);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(elementTimer);
      clearTimeout(focusTimer);
    };
  });

  return (
    <div>
      <Tooltip title="Recently viewed notes">
        <span>
          <IconButton
            aria-controls={menuOpen ? MENU_ID : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={handleClick}
            ref={menuAnchorRef}
            disabled={lastVisitedNotes.length === 0 || notesQuery.loading}
          >
            {notesQuery.loading ? <HistoryLoadingIcon /> : <HistoryIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        id={MENU_ID}
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
        {lastVisitedNotes.map((visitedNote, index) => (
          <MenuItem
            key={visitedNote.id}
            onClick={() => {
              navigateToNote(visitedNote);
              handleClose();
            }}
            id={menuItemId(index)}
          >
            {notesQuery.data?.notes?.find(
              (note) => note?._id === visitedNote.id
            )?.name || visitedNote.id}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LastVisitedNotes;
