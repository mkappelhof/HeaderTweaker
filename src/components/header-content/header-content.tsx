import { useCallback } from 'react';

import css from './header-content.module.scss';

interface HeaderContentProps {
  content: string;
}

export const HeaderContent = ({ content }: HeaderContentProps) => {
  const onClick = useCallback(async () => {
    const clipboardItem = new ClipboardItem({ 'text/plain': content });
    await navigator.clipboard.write([clipboardItem]);
  }, [content]);

  return (
    <button type="button" onClick={onClick} className={css.root}>
      {content}
    </button>
  );
};
