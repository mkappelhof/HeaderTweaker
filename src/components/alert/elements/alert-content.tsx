import type { FC, PropsWithChildren } from 'react';

import css from '../alert.module.scss';

export const AlertContent: FC<PropsWithChildren> = ({ children }) => {
  return <div className={css.content}>{children}</div>;
};

AlertContent.displayName = 'AlertContent';
