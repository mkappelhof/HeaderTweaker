import { type ComponentProps, useId } from 'react';

import css from './input.module.scss';

export const Input = ({
  type,
  placeholder,
  'aria-label': ariaLabel,
  ...props
}: ComponentProps<'input'>) => {
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
