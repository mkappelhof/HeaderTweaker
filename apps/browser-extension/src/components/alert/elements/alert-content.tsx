import type { FC, PropsWithChildren } from 'react';

import css from '../alert.module.scss';

export const AlertContent: FC<PropsWithChildren> = ({ children }) => (
  <div className={css.content}>{children}</div>
);

AlertContent.displayName = 'AlertContent';
