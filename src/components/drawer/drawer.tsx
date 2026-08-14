import type { FC } from 'react';
import {
  Modal,
  ModalClose,
  ModalContent,
  type ModalProps,
  ModalTitle,
} from '@components/modal/modal';

type DrawerProps = Omit<ModalProps, 'type'> & {
  title: string;
};

export const Drawer: FC<DrawerProps> = ({ title, children, ...props }) => {
  return (
    <Modal type="drawer" {...props}>
      <ModalTitle>{title}</ModalTitle>
      <ModalClose onClose={props.onClose} />
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};
