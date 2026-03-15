import { Button } from '@components/button/button';
import { ButtonGroup } from '@components/button/button-group';
import { ModalTitle } from '@components/modal/ModalTitle';
import { Modal } from '@components/modal/modal';
import { ModalIcon } from '@components/modal/modal.icon';
import { ModalContent } from '@components/modal/modal-content';
import { ModalFooter } from '@components/modal/modal-footer';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { SuccessProps } from './interfaces';

export const Success = ({
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
