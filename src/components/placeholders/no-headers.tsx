import type { FC } from 'react';
import { Text } from '@components/text/text';

import css from './placeholders.module.scss';

export const NoHeaders: FC<{ message: string }> = ({ message }) => {
  return (
    <div className={css.page}>
      <Text>{message}</Text>
    </div>
  );
};
