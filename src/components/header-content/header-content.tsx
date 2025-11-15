import { useCallback } from 'react';
import { Tooltip } from '@components/tooltip/tooltip';
import { TooltipContent } from '@components/tooltip/tooltip-content';
import { TooltipTrigger } from '@components/tooltip/tooltip-trigger';

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
    <Tooltip>
      <TooltipTrigger>
        <button type="button" className={css.root} onClick={onClick}>
          {content}
        </button>
      </TooltipTrigger>

      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
};
