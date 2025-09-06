import type { ComponentProps, ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

export interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'default' | 'ghost';
}

export const Button = ({ children, className, variant = 'default', ...props }: ButtonProps) => {
  return (
    <button
      className={classnames(css.root, className, {
        [css.ghost]: variant === 'ghost',
      })}
      {...props}
    >
      {children}
    </button>
  );
};
