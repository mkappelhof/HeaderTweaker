import type { FC, PropsWithChildren } from 'react';

import css from '../modal.module.scss';

type ModalIconProps = PropsWithChildren<Record<never, never>>;

const ModalIcon: FC<ModalIconProps> = ({ children }) => {
  return <div className={css.icon}>{children}</div>;
};

ModalIcon.displayName = 'ModalIcon';

export { ModalIcon };