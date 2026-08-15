import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react';

import css from './input.module.scss';

export const Input = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  ({ type, placeholder, 'aria-label': ariaLabel, ...props }, ref) => {
    const id = useId();

    return (
      <label htmlFor={id} className={css.root}>
        <input
          id={id}
          ref={ref}
          type={type}
          placeholder={placeholder}
          aria-label={ariaLabel || placeholder}
          {...props}
        />
      </label>
    );
  }
);

Input.displayName = 'Input';
