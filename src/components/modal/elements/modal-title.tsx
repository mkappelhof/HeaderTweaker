import type { FC, PropsWithChildren } from 'react';
import { Text } from '@components/text/text';

import css from '../modal.module.scss';

type ModalTitleProps = PropsWithChildren<Record<never, never>>;

const ModalTitle: FC<ModalTitleProps> = ({ children }) => {
  return (
    <div className={css.title}>
      <Text variant="h3">{children}</Text>
    </div>
  );
};

ModalTitle.displayName = 'ModalTitle';

export { ModalTitle };