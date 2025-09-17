import { IconButton, type IconButtonProps } from '@components/button/icon-button';
import { XCircleIcon } from '@heroicons/react/24/solid';

import css from './modal.module.scss';

interface ModalCloseProps {
  onClose: () => void;
  size?: IconButtonProps['size'];
}

const ModalClose = ({ onClose, size = 'large' }: ModalCloseProps) => {
  return (
    <div className={css.actions}>
      <IconButton onClick={onClose} aria-label="Close modal" size={size}>
        <XCircleIcon />
      </IconButton>
    </div>
  );
};

ModalClose.displayName = 'ModalClose';

export { ModalClose };
