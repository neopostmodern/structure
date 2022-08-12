import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NetworkMode } from '../actions/configuration';
import { RootState } from '../reducers';

const getOnlineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

const useIsOnline = () => {
  const networkMode = useSelector<RootState, NetworkMode>(
    (state) => state.configuration.networkMode
  );

  const [status, setStatus] = useState(getOnlineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  if (networkMode === NetworkMode.FORCE_ONLINE) {
    return true;
  }
  if (networkMode === NetworkMode.FORCE_OFFLINE) {
    return false;
  }

  return status;
};

export default useIsOnline;
