import type { Status as StatusType } from '@interfaces/index';
import classnames from 'clsx';

import css from './status.module.scss';

interface StatusProps {
  status: StatusType;
  label?: string;
}

export const Status = ({ status, label }: StatusProps) => {
  return (
    <div className={css.root}>
      <div className={classnames(css.indicator, { [css.disabled]: status === 'disabled' })} />
      {label && <small className={css.label}>{label}</small>}
    </div>
  );
};
