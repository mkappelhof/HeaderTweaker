import type { FC, PropsWithChildren } from 'react';

import css from '../modal.module.scss';

type ModalFooterProps = PropsWithChildren<Record<never, never>>;

const ModalFooter: FC<ModalFooterProps> = ({ children }) => {
  return <div className={css.footer}>{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';

export { ModalFooter };
