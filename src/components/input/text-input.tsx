import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react';

import css from './input.module.scss';

export type TextInputProps = ComponentPropsWithoutRef<'input'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ id: providedId, placeholder, 'aria-label': ariaLabel, type = 'text', ...props }, ref) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <label htmlFor={id} className={css.text}>
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

TextInput.displayName = 'TextInput';
