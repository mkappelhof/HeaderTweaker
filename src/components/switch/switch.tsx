import { type ComponentProps, memo, useCallback, useEffect, useState } from 'react';
import classnames from 'clsx';

import css from './switch.module.scss';

interface SwitchProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  isOn: boolean;
  label?: string;
  onChange: (state: boolean) => void;
}

export const Switch = memo(({ isOn, label, onChange, ...inputProps }: SwitchProps) => {
  const [checked, setChecked] = useState(isOn);

  useEffect(() => setChecked(isOn), [isOn]);

  const toggle = useCallback(() => {
    setChecked((prev) => {
      const state = !prev;
      onChange(state);
      return state;
    });
  }, [onChange]);

  return (
    <label className={classnames(css.root, { [css.disabled]: inputProps.disabled })}>
      <span>
        <input
          type="checkbox"
          checked={checked}
          onChange={toggle}
          className={css.root}
          aria-checked={checked}
          aria-label={label || 'Switch'}
          {...inputProps}
        />
        <div className={css.slider} />
      </span>
      {label && <span className={css.label}>{label}</span>}
    </label>
  );
});
