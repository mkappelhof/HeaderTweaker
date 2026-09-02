import type { FC } from 'react';
import type { AlertVariant } from '@components/alert/alert';
import { IconButton } from '@components/button/icon-button';
import { Text } from '@components/text/text';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from './toast.module.scss';

export type ToastItemProps = {
  message: string;
  isNotClosable?: boolean;
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
  onClose,
  isNotClosable = false,
  variant = 'neutral',
}) => {
  const { t } = useTranslation();
  const Icon = getIcon(variant);

  return (
    <div
      className={classnames(css.item, {
        [css.positive]: variant === 'positive',
        [css.negative]: variant === 'negative',
        [css.warning]: variant === 'warning',
        [css.notClosable]: isNotClosable,
      })}
    >
      <div className={css.icon}>
        <Icon />
      </div>

      <Text className={css.message}>{message}</Text>

      {!isNotClosable && (
        <div className={css.close}>
          <IconButton onClick={onClose} aria-label={t('button.toast.close')}>
            <XCircleIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};
