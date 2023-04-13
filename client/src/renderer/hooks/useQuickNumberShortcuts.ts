import { SHORTCUTS } from '../utils/keyboard';
import useShortcut from './useShortcut';

const useQuickNumberShortcuts = <K>(
  items: Array<K>,
  callback: (item: K) => void
) => {
  useShortcut(SHORTCUTS.QUICK_1, () => {
    if (items.length >= 1) {
      callback(items[0]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_2, () => {
    if (items.length >= 2) {
      callback(items[1]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_3, () => {
    if (items.length >= 3) {
      callback(items[2]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_4, () => {
    if (items.length >= 4) {
      callback(items[3]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_5, () => {
    if (items.length >= 5) {
      callback(items[4]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_6, () => {
    if (items.length >= 6) {
      callback(items[5]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_7, () => {
    if (items.length >= 7) {
      callback(items[6]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_8, () => {
    if (items.length >= 8) {
      callback(items[7]);
    }
  });
  useShortcut(SHORTCUTS.QUICK_9, () => {
    if (items.length >= 9) {
      callback(items[8]);
    }
  });
};

export default useQuickNumberShortcuts;
