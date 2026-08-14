import type { FC, PropsWithChildren } from 'react';

import css from '../modal.module.scss';

type ModalContentProps = PropsWithChildren<Record<never, never>>;

const ModalContent: FC<ModalContentProps> = ({ children }) => {
  return <div className={css.content}>{children}</div>;
};

ModalContent.displayName = 'ModalContent';

export { ModalContent };