import type { ReactNode } from 'react';
import { IconButton } from '@components/button/icon-button';
import { XCircleIcon } from '@heroicons/react/24/solid';
import classnames from 'clsx';
import { createPortal } from 'react-dom';

import css from './drawer.module.scss';

interface DrawerProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Drawer = ({ isOpen, title, onClose, children }: DrawerProps) => {
  const portalRoot = document.body;
  return createPortal(
    <>
      <button
        type="button"
        className={classnames(css.backdrop, {
          [css.isOpen]: isOpen,
        })}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onClick={onClose}
        aria-label="Close drawer"
        tabIndex={0}
      />
      <div
        className={classnames(css.drawer, {
          [css.isOpen]: isOpen,
        })}
      >
        <div className={css.header}>
          <h2>{title}</h2>
          <div className={css.actions}>
            <IconButton onClick={onClose} size="large">
              <XCircleIcon />
            </IconButton>
          </div>
        </div>
        <div className={css.content}>{children}</div>
      </div>
    </>,
    portalRoot
  );
};
