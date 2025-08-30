import type { ComponentProps } from 'react';

import css from './input.module.scss';

export const Input = ({ type, placeholder, ...props }: ComponentProps<'input'>) => {
  return <input type={type} placeholder={placeholder} className={css.root} {...props} />;
};
