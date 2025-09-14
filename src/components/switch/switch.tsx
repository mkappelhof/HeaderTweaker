import { useCallback, useEffect, useState } from 'react';

import css from './switch.module.scss';

interface SwitchProps {
  isOn: boolean;
  label?: string;
  onChange: (state: boolean) => void;
}

export const Switch = ({ isOn, label, onChange }: SwitchProps) => {
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
    <label className={css.root}>
      <span>
        <input type="checkbox" checked={checked} onChange={toggle} className={css.root} />
        <div className={css.slider} />
      </span>
      {label && <span className={css.label}>{label}</span>}
    </label>
  );
};
