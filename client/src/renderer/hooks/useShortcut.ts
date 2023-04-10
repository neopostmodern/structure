import { useEffect } from 'react';
import { bindShortcut } from '../utils/keyboard';

/**
 * Register a shortcut while the component is mounted
 * @param shortcut keycode, see Mousetrap docs for options
 * @param callback function to execute when shortcut is activated
 * @param global whether the shortcut should work from within textfields
 */
const useShortcut = (
  shortcut: Array<string> | null | undefined,
  callback: () => void,
  global = false
) => {
  useEffect(() => {
    if (!shortcut) {
      return;
    }

    return bindShortcut(shortcut, callback, global);
  }, [shortcut, callback]);
};

export default useShortcut;
