import Muya from '@marktext/muya';
import { useEffect, useRef } from 'react';

const RichMarkdownEditor = ({
  markdown,
  onBlur,
}: {
  markdown: string;
  onBlur: (value: string) => void;
}) => {
  const muyaContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!muyaContainer.current) {
      return;
    }

    const muya = new Muya(muyaContainer.current);
    muya.setContent(markdown);
  }, [muyaContainer]);

  return <div ref={muyaContainer}>Muya editor loading...</div>;
};

export default RichMarkdownEditor;
