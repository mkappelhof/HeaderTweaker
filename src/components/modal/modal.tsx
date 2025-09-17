import {
  Children,
  type FC,
  isValidElement,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import classnames from 'clsx';
import { createPortal } from 'react-dom';

import css from './modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  type: 'modal' | 'drawer' | 'alert' | 'confirm' | 'success';
}

export const Modal = ({ type, isOpen, onClose, children }: ModalProps) => {
  const modalRoot = document.body;

  const backdropRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isRendered, setIsisRendered] = useState(isOpen);
  const [isVisible, setIsisVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsisRendered(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRendered && isOpen) {
      setIsisVisible(false);
      document.body.style.overflow = 'hidden';

      const animationFrame = requestAnimationFrame(() => setIsisVisible(true));
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return () => cancelAnimationFrame(animationFrame);
    }
    if (isRendered && !isOpen) {
      setIsisVisible(false);
      document.body.style.overflow = '';

      timeoutRef.current = setTimeout(() => {
        setIsisRendered(false);
        timeoutRef.current = null;
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isRendered, isOpen]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return isRendered
    ? createPortal(
        <div
          ref={backdropRef}
          className={classnames(css.backdrop, {
            [css.open]: isVisible,
            [css.alert]: type === 'alert',
            [css.drawer]: type === 'drawer',
            [css.confirm]: type === 'confirm',
            [css.success]: type === 'success',
          })}
          onClick={handleBackdropClick}
          aria-hidden={!isOpen}
        >
          <div className={css.modal}>
            <div className={css.header}>
              {Children.map(children, (child) => {
                if (isValidElement(child) && (child.type as FC).displayName === 'ModalIcon') {
                  return child;
                }
              })}

              {Children.map(children, (child) => {
                if (isValidElement(child) && (child.type as FC).displayName === 'ModalTitle') {
                  return child;
                }
              })}

              {Children.map(children, (child) => {
                if (isValidElement(child) && (child.type as FC).displayName === 'ModalClose') {
                  return child;
                }
              })}
            </div>

            {Children.map(children, (child) => {
              if (isValidElement(child) && (child.type as FC).displayName === 'ModalContent') {
                return child;
              }
            })}

            {Children.map(children, (child) => {
              if (isValidElement(child) && (child.type as FC).displayName === 'ModalFooter') {
                return child;
              }
            })}
          </div>
        </div>,
        modalRoot
      )
    : null;
};
