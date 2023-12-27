import type { Markdown as _Markdown } from 'tiptap-markdown';
const dynamicImport = new Function('specifier', 'return import(specifier)');
const main = async () => {
  // import { Markdown } from 'tiptap-markdown';
  const { Markdown }: { Markdown: typeof _Markdown } = await dynamicImport(
    'tiptap-markdown'
  );

  console.dir(Markdown);
};

main();
