import type { FC } from 'react';
import { Text } from '@components/text/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/tooltip/tooltip';

import css from './header-content.module.scss';

type HeaderContentProps = {
  content: string;
};

export const HeaderContent: FC<HeaderContentProps> = ({ content }) => {
  const onClick = async () => {
    const clipboardItem = new ClipboardItem({ 'text/plain': content });
    await navigator.clipboard.write([clipboardItem]);
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <button type="button" className={css.root} onClick={onClick}>
          {content}
        </button>
      </TooltipTrigger>

      <TooltipContent>
        <Text>{content}</Text>
        <Text variant="body-small">(Click to copy to clipboard)</Text>
      </TooltipContent>
    </Tooltip>
  );
};
