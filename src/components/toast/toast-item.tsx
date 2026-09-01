import type { FC } from 'react';
import type { AlertVariant } from '@components/alert/alert';
import { Button } from '@components/button/button';
import { Text } from '@components/text/text';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './toast-item.module.scss';

export type ToastItemProps = {
  message: string;
  isCloseable?: boolean;
  variant?: AlertVariant;
  onClose?: () => void;
};

const getIcon = (variant: AlertVariant) => {
  switch (variant) {
    case 'positive':
      return CheckCircleIcon;
    case 'negative':
      return XCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    default:
      return InformationCircleIcon;
  }
};

export const ToastItem: FC<ToastItemProps> = ({
  message,
  isCloseable = false,
  variant = 'neutral',
  onClose,
}) => {
  const { t } = useTranslation();
  const Icon = getIcon(variant);

  return (
    <div
      className={classnames(css.root, {
        [css.positive]: variant === 'positive',
        [css.negative]: variant === 'negative',
        [css.warning]: variant === 'warning',
      })}
    >
      <div className={css.icon}>
        <Icon />
      </div>

      <Text variant="body-small" className={css.message}>
        {message}
      </Text>

      {isCloseable && (
        <Button variant="ghost" className={css.close} onClick={onClose}>
          {t('button.toast.close')}
        </Button>
      )}
    </div>
  );
};
