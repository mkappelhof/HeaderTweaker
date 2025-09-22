import type { ReactNode } from 'react';

import css from './modal.module.scss';

const ModalIcon = ({ children }: { children: ReactNode }) => {
  return <div className={css.icon}>{children}</div>;
};

ModalIcon.displayName = 'ModalIcon';

export { ModalIcon };
