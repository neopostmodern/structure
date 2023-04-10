import { Close, Launch } from '@mui/icons-material';
import { Checkbox, Drawer, IconButton } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  setBatchSelection,
  toggleBatchEditing,
} from '../actions/userInterface';
import { NotesForListQuery } from '../generated/graphql';
import useShortcut from '../hooks/useShortcut';
import { RootState } from '../reducers';
import {
  BatchSelectionType,
  UserInterfaceStateType,
} from '../reducers/userInterface';
import { containerWidth } from '../styles/constants';
import { SHORTCUTS } from '../utils/keyboard';
import Gap from './Gap';

const BatchEditingMenuContainer = styled.div`
  width: 100%;
  max-width: ${containerWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(1)} 0;
  display: flex;
  align-items: center;
`;

const NoteBatchEditingBar = ({
  notes,
}: {
  notes: NotesForListQuery['notes'];
}) => {
  const { batchEditing, batchSelections } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface);
  const dispatch = useDispatch();

  const selectedNoteCount = useMemo(
    () => Object.values(batchSelections).filter((selected) => selected).length,
    [batchSelections]
  );

  const handleCloseBatchMode = useCallback(
    () => dispatch(toggleBatchEditing()),
    [dispatch, toggleBatchEditing]
  );

  const selectUnselectAll = useCallback(
    (selected: boolean | React.ChangeEvent<HTMLInputElement> = false): void => {
      let nextSelectedState =
        typeof selected === 'boolean' ? selected : selected.target.checked;
      const selection: BatchSelectionType = {};
      if (typeof selected === 'undefined') {
        // if no selected target is passed in and all notes are selected, unselect them instead
        nextSelectedState = notes.length !== selectedNoteCount;
      }
      notes.forEach((note) => {
        selection[note._id] = nextSelectedState as boolean;
      });
      dispatch(setBatchSelection(selection));
    },
    [notes, selectedNoteCount]
  );

  const handleBatchOpenNotes = (): void => {
    notes.forEach((note) => {
      if (!batchSelections[note._id]) {
        return;
      }
      if (note.__typename !== 'Link') {
        return;
      }
      window.open(note.url, '_blank', 'noopener, noreferrer');
    });
  };

  useShortcut(SHORTCUTS.BATCH_EDITING, (): void => {
    dispatch(toggleBatchEditing());
  });
  useShortcut(SHORTCUTS.SELECT_ALL, () => {
    // if we're not already batch editing switch to batch editing mode
    if (!batchEditing) {
      dispatch(toggleBatchEditing());
    }

    selectUnselectAll();
  });

  return (
    <Drawer variant="persistent" anchor="top" open={batchEditing}>
      <BatchEditingMenuContainer>
        <Checkbox
          indeterminate={
            selectedNoteCount > 0 && selectedNoteCount !== notes.length
          }
          checked={selectedNoteCount === notes.length}
          onClick={selectUnselectAll}
        />
        {selectedNoteCount} selected
        <Gap horizontal={2} />
        <IconButton onClick={handleBatchOpenNotes}>
          <Launch />
        </IconButton>
        <div style={{ marginLeft: 'auto' }} />
        <IconButton onClick={handleCloseBatchMode}>
          <Close />
        </IconButton>
      </BatchEditingMenuContainer>
    </Drawer>
  );
};

export default NoteBatchEditingBar;
