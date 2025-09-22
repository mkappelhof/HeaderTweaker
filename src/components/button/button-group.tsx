import type { ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

interface ButtonGroupProps {
  direction?: 'horizontal' | 'vertical';
  withoutSpacing?: boolean;
  children: ReactNode;
}

export const ButtonGroup = ({
  children,
  direction = 'horizontal',
  withoutSpacing = false,
}: ButtonGroupProps) => {
  return (
    <div
      className={classnames(css.group, {
        [css.withoutSpacing]: withoutSpacing,
        [css.vertical]: direction === 'vertical',
      })}
    >
      {children}
    </div>
  );
};
