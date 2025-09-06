import {
  Children,
  type FC,
  isValidElement,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import { IconButton } from '@components/button/icon-button';
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import classnames from 'clsx';
import { createPortal } from 'react-dom';

import css from './modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  type: 'modal' | 'alert' | 'confirm';
  isClosable?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  type,
  isClosable = true,
}: ModalProps) => {
  const modalRoot = document.body;
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={backdropRef}
      className={classnames(css.backdrop, {
        [css.open]: isOpen,
      })}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div className={classnames(css.modal, { [css.confirm]: type === 'confirm' })}>
        <div className={css.header}>
          <div className={css.icon}>
            <InformationCircleIcon />
          </div>

          <h3>{title}</h3>

          {isClosable && (
            <div className={css.actions}>
              <IconButton onClick={onClose} aria-label="Close modal">
                <XCircleIcon />
              </IconButton>
            </div>
          )}
        </div>

        <div className={css.content}>
          {Children.map(children, (child) => {
            if (isValidElement(child) && (child.type as FC).displayName === 'ModalContent') {
              return child;
            }
          })}
        </div>

        <div className={css.footer}>
          {Children.map(children, (child) => {
            if (isValidElement(child) && (child.type as FC).displayName === 'ModalFooter') {
              return child;
            }
          })}
        </div>
      </div>
    </div>,
    modalRoot
  );
};
