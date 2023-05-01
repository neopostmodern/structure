import { useEffect } from 'react';
import { bindShortcut } from '../utils/keyboard';

/**
 * Register a shortcut while the component is mounted
 * @param shortcut keycode, see Mousetrap docs for options
 * @param callback function to execute when shortcut is activated
 */
const useShortcut = (
  shortcut: Array<string> | null | undefined,
  callback: (event: KeyboardEvent) => void
) => {
  useEffect(() => {
    if (!shortcut) {
      return;
    }

    return bindShortcut(shortcut, callback);
  }, [shortcut, callback]);
};

export default useShortcut;
