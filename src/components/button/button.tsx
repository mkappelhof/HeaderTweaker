import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import classnames from 'clsx';

import css from './button.module.scss';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode;
  variant?: 'default' | 'ghost';
};

export const Button: FC<ButtonProps> = ({
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
};
