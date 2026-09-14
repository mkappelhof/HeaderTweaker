import { cloneElement, type FC, isValidElement } from 'react';
import { useToastContext } from '@contexts/toast.context';
import { createPortal } from 'react-dom';
import { ToastWrapper } from './elements/toast-wrapper';

import css from './toast.module.scss';

export const Toast: FC = () => {
  const { toasts, removeToast } = useToastContext();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className={css.root}>
      {toasts.map(({ id, node }) => (
        <ToastWrapper key={id} onDismiss={() => removeToast(id)}>
          {isValidElement(node) ? cloneElement(node, { onClose: () => removeToast(id) }) : node}
        </ToastWrapper>
      ))}
    </div>,
    document.body
  );
};
