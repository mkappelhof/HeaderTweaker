import { type ComponentProps, useEffect, useState } from 'react';
import { Text } from '@components/text/text';
import classnames from 'clsx';

import css from './switch.module.scss';

interface SwitchProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  isOn: boolean;
  label?: string;
  onChange: (state: boolean) => void;
}

export const Switch = ({ isOn, label, onChange, ...inputProps }: SwitchProps) => {
  const [checked, setChecked] = useState(isOn);

  useEffect(() => setChecked(isOn), [isOn]);

  const toggle = () => {
    const newState = !checked;
    setChecked(newState);
    onChange(newState);
  };

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
      {label && (
        <Text as="span" className={css.label}>
          {label}
        </Text>
      )}
    </label>
  );
};
