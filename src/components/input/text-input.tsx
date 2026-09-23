import { type ComponentPropsWithoutRef, forwardRef, useId } from 'react';
import { Text } from '@components/text/text';
import classnames from 'clsx';

import css from './input.module.scss';

export type TextInputProps = ComponentPropsWithoutRef<'input'> & { label?: string };

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      className,
      placeholder,
      id: providedId,
      'aria-label': ariaLabel,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
      <div className={classnames(css.root, className)}>
        <label htmlFor={id}>
          <Text variant="body-small">{label}</Text>
        </label>
        <div className={css.text}>
          <input
            id={id}
            ref={ref}
            type={type}
            placeholder={placeholder}
            aria-label={ariaLabel || placeholder}
            {...props}
          />
        </div>
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
