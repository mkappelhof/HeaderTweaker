import type { ReactNode } from 'react';

import css from './modal.module.scss';

const ModalTitle = ({ children }: { children: ReactNode }) => {
  return (
    <div className={css.title}>
      <h3>{children}</h3>
    </div>
  );
};

ModalTitle.displayName = 'ModalTitle';

export { ModalTitle };
