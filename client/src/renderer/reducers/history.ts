import { createReducer } from 'redux-act';
import {
  addNoteToHistory,
  registerHistoryBackward,
  registerHistoryForward,
} from '../actions/history';

export type NoteSummary = { type: 'link' | 'text'; id: string };
export interface HistoryStateType {
  lastVisitedNotes: Array<NoteSummary>;
  lengthOfPast: number;
  lengthOfFuture: number;
}

const initialState: HistoryStateType = {
  lastVisitedNotes: [],
  lengthOfPast: 0,
  lengthOfFuture: 0,
};

const NOTE_HISTORY_LENGTH = 10;

export default createReducer<HistoryStateType>(
  {
    [addNoteToHistory as any]: (state, payload) => ({
      ...state,
      lastVisitedNotes: [
        payload,
        ...state.lastVisitedNotes.filter((note) => note.id !== payload.id),
      ].slice(0, NOTE_HISTORY_LENGTH),
    }),
    [registerHistoryForward as any]: (state) => ({
      ...state,
      lengthOfPast: Math.max(0, state.lengthOfPast + 1),
      lengthOfFuture: Math.max(0, state.lengthOfFuture - 1),
    }),
    [registerHistoryBackward as any]: (state) => ({
      ...state,
      lengthOfPast: Math.max(0, state.lengthOfPast - 1),
      lengthOfFuture: Math.max(0, state.lengthOfFuture + 1),
    }),
  },
  initialState
);
