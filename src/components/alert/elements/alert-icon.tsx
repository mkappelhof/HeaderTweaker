import type { FC, PropsWithChildren } from 'react';

import css from '../alert.module.scss';

export const AlertIcon: FC<PropsWithChildren> = ({ children }) => {
  return <div className={css.icon}>{children}</div>;
};

AlertIcon.displayName = 'AlertIcon';
