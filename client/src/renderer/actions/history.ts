import { createAction } from 'redux-act';
import { NoteSummary } from '../reducers/history';

export const addNoteToHistory = createAction<NoteSummary>();
export const registerHistoryForward = createAction();
export const registerHistoryBackward = createAction();
