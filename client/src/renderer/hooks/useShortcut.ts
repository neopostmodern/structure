import Mousetrap from 'mousetrap';
import { useEffect } from 'react';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';

makeMousetrapGlobal(Mousetrap);

/**
 * Register a shortcut while the component is mounted
 * @param shortcut keycode, see Mousetrap docs for options
 * @param callback function to execute when shortcut is activated
 * @param global whether the shortcut should work from within textfields
 */
const useShortcut = (
  shortcut: Array<string> | string | null | undefined,
  callback: () => void,
  global = false
) => {
  useEffect(() => {
    if (!shortcut) {
      return;
    }

    (global ? Mousetrap.bindGlobal : Mousetrap.bind)(shortcut, callback);
    return (): void => {
      Mousetrap.unbind(shortcut);
    };
  }, [shortcut, callback]);
};

export default useShortcut;
