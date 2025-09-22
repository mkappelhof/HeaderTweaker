import { type ComponentProps, memo, type ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

export interface ButtonProps extends ComponentProps<'button'> {
  children: ReactNode;
  variant?: 'default' | 'ghost';
}

export const Button = memo(
  ({
    children,
    className,
    'aria-label': ariaLabel,
    variant = 'default',
    ...props
  }: ButtonProps) => {
    return (
      <button
        className={classnames(css.root, className, {
          [css.ghost]: variant === 'ghost',
        })}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);
