import type { FC } from 'react';
import { Button } from '@components/button/button';
import { ButtonGroup } from '@components/button/button-group';
import { Modal, ModalContent, ModalFooter, ModalIcon, ModalTitle } from '@components/modal/modal';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { SuccessProps } from './interfaces';

export const Success: FC<SuccessProps> = ({
  message,
  onConfirm,
  confirmText = 'OK',
  ...modalProps
}: SuccessProps) => (
  <Modal type="success" {...modalProps}>
    <ModalIcon>
      <CheckCircleIcon />
    </ModalIcon>
    <ModalTitle>Success</ModalTitle>
    <ModalContent>{message}</ModalContent>
    <ModalFooter>
      <ButtonGroup>
        <Button onClick={onConfirm}>{confirmText}</Button>
      </ButtonGroup>
    </ModalFooter>
  </Modal>
);
