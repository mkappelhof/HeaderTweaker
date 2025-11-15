import type { ReactNode } from 'react';
import { Text } from '@components/text/text';

import css from './modal.module.scss';

const ModalTitle = ({ children }: { children: ReactNode }) => {
  return (
    <div className={css.title}>
      <Text variant="h3">{children}</Text>
    </div>
  );
};

ModalTitle.displayName = 'ModalTitle';

export { ModalTitle };
