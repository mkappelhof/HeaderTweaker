import type { FC, ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

type ButtonGroupProps = {
  direction?: 'horizontal' | 'vertical';
  withoutSpacing?: boolean;
  children: ReactNode;
};

export const ButtonGroup: FC<ButtonGroupProps> = ({
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
