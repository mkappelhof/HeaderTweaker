import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import classnames from 'clsx';
import CheckIcon from 'headertweaker-icons/24/solid/check.svg?react';
import MinusIcon from 'headertweaker-icons/24/solid/minus.svg?react';

import css from './input.module.scss';

export const INTERMEDIATE_INDICATOR = '-';

export type CheckboxState = boolean | typeof INTERMEDIATE_INDICATOR;

export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'checked' | 'type'> & {
  label?: string;
  checked?: CheckboxState;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id: providedId, checked, 'aria-checked': ariaChecked, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const generatedId = useId();
    const id = providedId ?? generatedId;

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = checked === INTERMEDIATE_INDICATOR;
    }, [checked]);

    return (
      <div className={classnames(css.root, css.checkbox)}>
        <div className={css.inputWrapper}>
          <input
            id={id}
            ref={inputRef}
            type="checkbox"
            checked={checked === undefined ? undefined : checked === true}
            aria-checked={checked === INTERMEDIATE_INDICATOR ? 'mixed' : ariaChecked}
            {...props}
          />
          {checked === INTERMEDIATE_INDICATOR ? (
            <MinusIcon aria-hidden="true" className={css.checkIcon} />
          ) : (
            <CheckIcon aria-hidden="true" className={css.checkIcon} />
          )}
        </div>
        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
