import { Button } from '@components/button/button';
import { ButtonGroup } from '@components/button/button-group';
import { Modal } from '@components/modal/modal';
import { ModalContent } from '@components/modal/modal-content';
import { ModalFooter } from '@components/modal/modal-footer';
import type { ConfirmProps } from './interfaces';

export const Confirm = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
  ...modalProps
}: ConfirmProps) => (
  <Modal type="confirm" isClosable={false} {...modalProps}>
    <ModalContent>{message}</ModalContent>
    <ModalFooter>
      <ButtonGroup>
        <Button onClick={onConfirm}>{confirmText}</Button>
        <Button variant="ghost" onClick={onCancel}>
          {cancelText}
        </Button>
      </ButtonGroup>
    </ModalFooter>
  </Modal>
);
