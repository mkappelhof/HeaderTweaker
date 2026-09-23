import type { FC } from 'react';
import { Text } from '@components/text/text';
import classnames from 'clsx';

import css from './status.module.scss';

type StatusProps = {
  status: string;
  label?: string;
};

export const Status: FC<StatusProps> = ({ status, label }) => {
  return (
    <div className={css.root}>
      <div className={classnames(css.indicator, { [css.disabled]: status === 'disabled' })} />
      {label && (
        <Text variant="body-small" className={css.label}>
          {label}
        </Text>
      )}
    </div>
  );
};
