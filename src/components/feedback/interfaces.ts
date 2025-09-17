import type { ModalProps } from '@components/modal/modal';

type FeedbackProps = Omit<ModalProps, 'type' | 'isClosable' | 'title' | 'children'>;

export interface ConfirmProps extends FeedbackProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface SuccessProps extends FeedbackProps {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}
