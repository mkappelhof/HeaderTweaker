import type { ReactNode } from 'react';

import css from './modal.module.scss';

const ModalContent = ({ children }: { children: ReactNode }) => {
  return <div className={css.content}>{children}</div>;
};

ModalContent.displayName = 'ModalContent';

export { ModalContent };
