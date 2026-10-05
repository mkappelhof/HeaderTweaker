import type { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import classnames from 'clsx';
import ArrowPathIcon from 'headertweaker-icons/16/solid/arrow-path.svg?react';

import css from './button.module.scss';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  children: ReactNode;
  loading?: boolean;
  variant?: 'default' | 'ghost' | 'link';
};

export const Button: FC<ButtonProps> = ({
  children,
  className,
  'aria-label': ariaLabel,
  disabled = false,
  loading = false,
  variant = 'default',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={classnames(css.root, className, {
        [css.ghost]: variant === 'ghost',
        [css.link]: variant === 'link',
      })}
      aria-label={ariaLabel}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <div className={css.loading}>
          <ArrowPathIcon className={css.loadingIcon} />
        </div>
      )}
      {children}
    </button>
  );
};
