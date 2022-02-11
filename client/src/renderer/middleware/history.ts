import { Middleware } from 'redux';
import { CALL_HISTORY_METHOD, LOCATION_CHANGE } from 'redux-first-history';
import {
  addNoteToHistory,
  registerHistoryBackward,
  registerHistoryForward,
} from '../actions/history';
import { RootState } from '../reducers';

const historyMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    console.log(action);
    if (action.type === CALL_HISTORY_METHOD) {
      if (action.payload.method === 'goBack') {
        store.dispatch(registerHistoryBackward());
      }
      if (action.payload.method === 'goForward') {
        store.dispatch(registerHistoryForward());
      }
    }

    if (action.type === LOCATION_CHANGE) {
      const {
        location: { pathname },
        action: navigationAction,
      } = action.payload;

      if (navigationAction === 'PUSH') {
        store.dispatch(registerHistoryForward());
      }

      if (
        pathname &&
        (pathname.includes('links') || pathname.includes('texts'))
      ) {
        const [, type, id] = pathname.split('/');
        store.dispatch(
          addNoteToHistory({ type: type.substr(0, type.length - 1), id })
        );
      }
    }
    return next(action);
  };

export default historyMiddleware;
