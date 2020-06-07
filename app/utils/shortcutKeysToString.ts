export default function shortcutKeysToString(shortcutKeys: string[]): string {
  return shortcutKeys
    .map((shortcutKey) => shortcutKey.replace('command', '⌘'))
    .join(' / ')
}
