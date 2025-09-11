import Mousetrap from 'mousetrap';
import makeMousetrapGlobal from '../utils/mousetrapGlobal';

makeMousetrapGlobal(Mousetrap);

export const GLOBAL = 'GLOBAL/';
export const MODIFIER = 'REGULAR_MODIFIER';
export const DESKTOP_ONLY_MODIFIER = 'DESKTOP_ONLY_MODIFIER';
export enum Modifier {
  CONTROL = 'CONTROL',
  COMMAND = 'COMMAND',
}

const config = {
  modifier: Modifier.CONTROL,
};
(async () => {
  if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    config.modifier = Modifier.COMMAND;
  }
})();

export const getModifier = () => config.modifier;

export const adaptShortcutsForPlatform = (
  shortcuts: Array<string | false>
): Array<string> =>
  shortcuts
    .filter((shortcut): shortcut is string => Boolean(shortcut))
    .map((shortcut) => {
      if (shortcut.includes(DESKTOP_ONLY_MODIFIER)) {
        const desktopShortcut = shortcut.replace(
          DESKTOP_ONLY_MODIFIER,
          MODIFIER
        );
        const webShortcut = shortcut
          .replace(DESKTOP_ONLY_MODIFIER + '+', '')
          .replace(GLOBAL, '');
        if (__BUILD_TARGET__ === 'web') {
          return webShortcut;
        } else {
          return [desktopShortcut, webShortcut];
        }
      }
      return shortcut;
    })
    .flat()
    .map((shortcut) =>
      shortcut.replace(
        MODIFIER,
        getModifier() === Modifier.COMMAND ? 'command' : 'ctrl'
      )
    );

export const QUICK_ACCESS_SHORTCUT_PREFIX = 'QUICK_';
const shortcutTemplates: { [shortcutName: string]: Array<string | false> } = {
  HOME_PAGE: [`${GLOBAL}${MODIFIER}+.`, 'esc'],
  SETTINGS_PAGE: [`${GLOBAL}${MODIFIER}+,`],
  QUICK_SUBMIT: [`${GLOBAL}${MODIFIER}+enter`],
  QUICK_NAVIGATION: [
    __BUILD_TARGET__ === 'electron_renderer' && `${GLOBAL}ctrl+tab`,
    'k',
  ],
  DEV_TOOLS: [`${GLOBAL}f12`, `${GLOBAL}ctrl+shift+i`],

  SELECT_ALL: [`${MODIFIER}+a`],
  BATCH_EDITING: [`${MODIFIER}+b`],
  EDIT: [`${GLOBAL}${MODIFIER}+e`],
  SEARCH: [`${MODIFIER}+k`, `${MODIFIER}+f`],
  NEW_NOTE_PAGE: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+n`],
  REFRESH: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+r`],
  ADD_TAG: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+t`],

  [`${QUICK_ACCESS_SHORTCUT_PREFIX}1`]: [`${GLOBAL}${MODIFIER}+1`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}2`]: [`${GLOBAL}${MODIFIER}+2`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}3`]: [`${GLOBAL}${MODIFIER}+3`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}4`]: [`${GLOBAL}${MODIFIER}+4`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}5`]: [`${GLOBAL}${MODIFIER}+5`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}6`]: [`${GLOBAL}${MODIFIER}+6`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}7`]: [`${GLOBAL}${MODIFIER}+7`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}8`]: [`${GLOBAL}${MODIFIER}+8`],
  [`${QUICK_ACCESS_SHORTCUT_PREFIX}9`]: [`${GLOBAL}${MODIFIER}+9`],
};
export const SHORTCUTS: {
  [shortcutName: string]: Array<string>;
} = {};
for (const shortcutName in shortcutTemplates) {
  SHORTCUTS[shortcutName] = adaptShortcutsForPlatform(
    shortcutTemplates[shortcutName]
  );
}

export const getKeyForDisplay = (keyDescription: string): string => {
  if (keyDescription === Modifier.COMMAND) {
    return '⌘';
  }
  if (keyDescription === Modifier.CONTROL) {
    return 'ctrl';
  }
  if (keyDescription === 'enter') {
    return '↵';
  }
  return keyDescription;
};

export const bindShortcut = (
  shortcuts: Array<string>,
  callback: (event: KeyboardEvent) => void
): (() => void) => {
  let wrappedCallback = (event: KeyboardEvent) => {
    event.preventDefault();
    callback(event);
  };
  shortcuts.forEach((shortcut) => {
    if (shortcut.includes(GLOBAL)) {
      Mousetrap.bindGlobal(shortcut.replace(GLOBAL, ''), wrappedCallback);
    } else {
      Mousetrap.bind(shortcut, wrappedCallback);
    }
  });

  return (): void => {
    shortcuts.forEach((shortcut) => {
      Mousetrap.unbind(shortcut.replace(GLOBAL, ''));
    });
  };
};
