import type { FC, PropsWithChildren } from 'react';
import { Text, type TextProps } from '@components/text/text';

import css from '../alert.module.scss';

export const AlertTitle: FC<PropsWithChildren<TextProps>> = ({
  children,
  variant = 'h3',
  ...textProps
}) => {
  return (
    <div className={css.title}>
      <Text variant={variant} {...textProps}>
        {children}
      </Text>
    </div>
  );
};

AlertTitle.displayName = 'AlertTitle';
