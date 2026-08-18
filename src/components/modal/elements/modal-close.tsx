import type { FC } from 'react';
import { IconButton, type IconButtonProps } from '@components/button/icon-button';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import css from '../modal.module.scss';

type ModalCloseProps = {
  onClose: () => void;
  size?: IconButtonProps['size'];
};

const ModalClose: FC<ModalCloseProps> = ({ onClose, size = 'large' }) => {
  const { t } = useTranslation();

  return (
    <div className={css.actions}>
      <IconButton onClick={onClose} aria-label={t('modal.close')} size={size}>
        <XCircleIcon />
      </IconButton>
    </div>
  );
};

ModalClose.displayName = 'ModalClose';

export { ModalClose };
