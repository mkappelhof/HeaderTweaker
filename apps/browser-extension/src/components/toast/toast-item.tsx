import type { FC } from 'react';
import type { AlertVariant } from '@components/alert/alert';
import { IconButton } from '@components/button/icon-button';
import { Text } from '@components/text/text';
import { MAX_TOAST_LENGTH } from '@constants/toast';
import classnames from 'clsx';
import CheckCircleIcon from 'headertweaker-icons/24/outline/check-circle.svg?react';
import ExclamationTriangleIcon from 'headertweaker-icons/24/outline/exclamation-triangle.svg?react';
import InformationCircleIcon from 'headertweaker-icons/24/outline/information-circle.svg?react';
import XCircleIcon from 'headertweaker-icons/24/solid/x-circle.svg?react';
import { useTranslation } from 'react-i18next';

import css from './toast.module.scss';

export type ToastItemProps = {
  message: string;
  size?: 'small' | 'normal';
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
  size = 'small',
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
        [css.small]: size === 'small',
        [css.notClosable]: isNotClosable,
      })}
    >
      <div className={css.icon}>
        <Icon />
      </div>

      <Text className={css.message} variant={size === 'small' ? 'body-small' : 'body'}>
        {message.length > MAX_TOAST_LENGTH ? `${message.slice(0, MAX_TOAST_LENGTH)}…` : message}
      </Text>

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
