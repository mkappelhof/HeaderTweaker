import { memo } from 'react';
import { ModalTitle } from '@components/modal/ModalTitle';
import { Modal, type ModalProps } from '@components/modal/modal';
import { ModalClose } from '@components/modal/modal-close';
import { ModalContent } from '@components/modal/modal-content';

interface DrawerProps extends Omit<ModalProps, 'type'> {
  title: string;
}

export const Drawer = memo(({ title, children, ...props }: DrawerProps) => {
  return (
    <Modal type="drawer" {...props}>
      <ModalTitle>{title}</ModalTitle>
      <ModalClose onClose={props.onClose} />
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
});
