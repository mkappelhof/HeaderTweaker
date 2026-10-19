import type { FC, PropsWithChildren } from 'react';
import { Text } from '@components/text/text';

import css from './pill.module.scss';

export const Pill: FC<PropsWithChildren> = ({ children }) => (
  <Text className={css.root} variant="body-small">
    {children}
  </Text>
);
