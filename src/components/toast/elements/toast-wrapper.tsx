import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import classnames from 'clsx';

import css from '../toast.module.scss';

const TOAST_DURATION_MS = 5000;

type ToastWrapperProps = PropsWithChildren<{ onDismiss: () => void }>;

export const ToastWrapper: FC<ToastWrapperProps> = ({ onDismiss, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));
    const timeout = setTimeout(onDismiss, TOAST_DURATION_MS);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [onDismiss]);

  return <div className={classnames(css.wrapper, { [css.visible]: isVisible })}>{children}</div>;
};
