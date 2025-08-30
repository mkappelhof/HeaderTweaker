import type { ComponentProps, ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

export interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={classnames(css.root, className)} {...props}>
      {children}
    </button>
  );
};
