import { createAction } from 'redux-act';
import { NoteSummary } from '../reducers/history';

export const ADD_NOTE_TO_HISTORY = 'ADD_NOTE_TO_HISTORY';
export const addNoteToHistory = createAction<NoteSummary>(ADD_NOTE_TO_HISTORY);
export const registerHistoryForward = createAction();
export const registerHistoryBackward = createAction();
