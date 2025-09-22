import type { ReactNode } from 'react';

import css from './modal.module.scss';

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className={css.footer}>{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';

export { ModalFooter };
