import type { ModalProps } from '@components/modal/modal';

type FeedbackProps = Omit<ModalProps, 'type' | 'isClosable' | 'title' | 'children'>;

export type ConfirmProps = FeedbackProps & {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type SuccessProps = FeedbackProps & {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
};
