import type { FC } from 'react';
import { Button } from '@components/button/button';
import { ButtonGroup } from '@components/button/button-group';
import { Modal, ModalContent, ModalFooter, ModalIcon, ModalTitle } from '@components/modal/modal';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import type { SuccessProps } from './interfaces';

export const Success: FC<SuccessProps> = ({
  message,
  onConfirm,
  confirmText,
  ...modalProps
}: SuccessProps) => {
  const { t } = useTranslation();

  return (
    <Modal type="success" {...modalProps}>
      <ModalIcon>
        <CheckCircleIcon />
      </ModalIcon>
      <ModalTitle>{t('title.feedback.success.default')}</ModalTitle>
      <ModalContent>{message}</ModalContent>
      <ModalFooter>
        <ButtonGroup>
          <Button onClick={onConfirm}>{confirmText ?? t('button.feedback.confirm')}</Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};
