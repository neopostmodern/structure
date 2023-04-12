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
  if (navigator.keyboard) {
    const layoutMap = await navigator.keyboard.getLayoutMap();

    if (layoutMap.has('MetaLeft') || layoutMap.has('MetaRight')) {
      config.modifier = Modifier.COMMAND;
    }
  } else if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    config.modifier = Modifier.COMMAND;
  }
})();

export const getModifier = () => config.modifier;

export const adaptShortcutsForPlatform = (
  shortcuts: Array<string>
): Array<string> =>
  shortcuts
    .map((shortcut) => {
      if (shortcut.includes(DESKTOP_ONLY_MODIFIER)) {
        const desktopShortcut = shortcut.replace(
          DESKTOP_ONLY_MODIFIER,
          MODIFIER
        );
        const webShortcut = shortcut
          .replace(DESKTOP_ONLY_MODIFIER + '+', '')
          .replace(GLOBAL, '');
        if (process.env.TARGET === 'web') {
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

export const SHORTCUTS: { [shortcutName: string]: Array<string> } = {
  HOME_PAGE: [`${GLOBAL}${MODIFIER}+.`, 'esc'],
  QUICK_SUBMIT: [`${GLOBAL}${MODIFIER}+enter`],
  DEV_TOOLS: [`${GLOBAL}f12`, `${GLOBAL}ctrl+shift+i`],

  SELECT_ALL: [`${MODIFIER}+a`],
  BATCH_EDITING: [`${MODIFIER}+b`],
  EDIT: [`${GLOBAL}${MODIFIER}+e`],
  SEARCH: [`${MODIFIER}+k`, `${MODIFIER}+f`],
  NEW_NOTE_PAGE: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+n`],
  REFRESH: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+r`],
  ADD_TAG: [`${GLOBAL}${DESKTOP_ONLY_MODIFIER}+t`],
};
for (const shortcutName in SHORTCUTS) {
  SHORTCUTS[shortcutName] = adaptShortcutsForPlatform(SHORTCUTS[shortcutName]);
}
console.log(SHORTCUTS);

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
  callback: () => void
): (() => void) => {
  let wrappedCallback = (event: KeyboardEvent) => {
    event.preventDefault();
    callback();
  };
  shortcuts.forEach((shortcut) => {
    if (shortcut.includes(GLOBAL)) {
      Mousetrap.bindGlobal(shortcut.replace(GLOBAL, ''), wrappedCallback);
    } else {
      Mousetrap.bind(shortcut, wrappedCallback);
    }
  });

  return (): void => {
    Mousetrap.unbind(shortcuts.map((shortcut) => shortcut.replace(GLOBAL, '')));
  };
};
