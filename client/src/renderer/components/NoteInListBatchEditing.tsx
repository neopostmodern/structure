import { Checkbox } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setBatchSelected } from '../actions/userInterface'
import { RootState } from '../reducers'
import { UserInterfaceStateType } from '../reducers/userInterface'
import Gap from './Gap'

const NoteInListBatchEditing = ({ noteId }: { noteId: string }) => {
  const { batchEditing, batchSelections } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface)
  const dispatch = useDispatch()

  const handleCheckboxClick = useCallback(
    (event): void => {
      dispatch(setBatchSelected(noteId, event.target.checked))
    },
    [dispatch, setBatchSelected],
  )

  if (!batchEditing) {
    return null
  }

  return (
    <>
      <Checkbox
        checked={batchSelections[noteId] || false}
        onClick={handleCheckboxClick}
      />
      <Gap horizontal={1} />
    </>
  )
}

export default React.memo(NoteInListBatchEditing)
