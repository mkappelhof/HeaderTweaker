import { Children, type FC, isValidElement, type PropsWithChildren } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import classnames from 'clsx';
import { AlertIcon } from './elements/alert-icon';

export { AlertContent } from './elements/alert-content';
export { AlertIcon } from './elements/alert-icon';
export { AlertTitle } from './elements/alert-title';

import css from './alert.module.scss';

type AlertProps = {
  variant?: 'positive' | 'neutral' | 'negative' | 'warning';
};

const getIcon = (variant: AlertProps['variant']) => {
  switch (variant) {
    default:
      return InformationCircleIcon;
  }
};

export const Alert: FC<PropsWithChildren<AlertProps>> = ({ variant = 'neutral', children }) => {
  const Icon = getIcon(variant);

  return (
    <div className={classnames(css.root, { [css.warning]: variant === 'warning' })}>
      <div className={css.icon}>
        {!children ||
        !Children.toArray(children).some(
          (child) => isValidElement(child) && (child.type as FC).displayName === 'AlertIcon'
        ) ? (
          <AlertIcon>
            <Icon />
          </AlertIcon>
        ) : (
          Children.map(children, (child) => {
            if (isValidElement(child) && (child.type as FC).displayName === 'AlertIcon') {
              return child;
            }
          })
        )}
      </div>

      <div className={css.info}>
        {Children.map(children, (child) => {
          if (isValidElement(child) && (child.type as FC).displayName === 'AlertTitle') {
            return child;
          }
        })}
        {Children.map(children, (child) => {
          if (isValidElement(child) && (child.type as FC).displayName === 'AlertContent') {
            return child;
          }
        })}
      </div>
    </div>
  );
};
