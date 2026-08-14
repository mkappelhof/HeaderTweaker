import { type ComponentPropsWithoutRef, type FC, useId } from 'react';

import css from './input.module.scss';

export const Input: FC<ComponentPropsWithoutRef<'input'>> = ({
  type,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: ComponentPropsWithoutRef<'input'>) => {
  const id = useId();

  return (
    <label htmlFor={id} className={css.root}>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        {...props}
      />
    </label>
  );
};
