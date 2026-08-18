import type { FC } from 'react';
import { Button } from '@components/button/button';
import { ButtonGroup } from '@components/button/button-group';
import { Modal, ModalContent, ModalFooter, ModalTitle } from '@components/modal/modal';
import { useTranslation } from 'react-i18next';
import type { ConfirmProps } from './interfaces';

export const Confirm: FC<ConfirmProps> = ({
  message,
  onConfirm,
  onCancel,
  title,
  confirmText,
  cancelText,
  ...modalProps
}: ConfirmProps) => {
  const { t } = useTranslation();

  return (
    <Modal type="confirm" {...modalProps}>
      <ModalTitle>{title}</ModalTitle>
      <ModalContent>{message}</ModalContent>
      <ModalFooter>
        <ButtonGroup>
          <Button onClick={onConfirm}>{confirmText ?? t('feedback.confirm')}</Button>
          <Button variant="ghost" onClick={onCancel}>
            {cancelText ?? t('feedback.cancel')}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
};
