import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import classnames from 'clsx';
import { createPortal } from 'react-dom';

import css from './tooltip.module.scss';

export interface TooltipProps {
  children: ReactNode;
  delay?: number;
}

export const Tooltip: FC<TooltipProps> = memo(({ children, delay = 200 }) => {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const handleMouseEnter = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      setIsRendered(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
    fadeTimeoutRef.current = setTimeout(() => setIsRendered(false), 150);
  }, []);

  useEffect(() => {
    if (isRendered && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      const spacing = 8;

      const top = rect.top - (tooltipRect?.height || 0) - spacing;
      const left = rect.left + rect.width / 2;

      setCoords({ top, left });

      const animationFrame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(animationFrame);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }
    };
  }, [isRendered]);

  const triggerProps = useMemo(
    () => ({
      ref: triggerRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      'aria-describedby': isVisible ? tooltipId : undefined,
    }),
    [handleMouseEnter, handleMouseLeave, isVisible, tooltipId]
  );

  const tooltipClassName = useMemo(
    () => classnames(css.tooltip, { [css.visible]: isVisible }),
    [isVisible]
  );

  let trigger: ReactNode = null;
  let content: ReactNode = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child.type as FC).displayName === 'TooltipTrigger') {
      const triggerChild = (child.props as { children: ReactNode }).children;
      trigger = isValidElement(triggerChild)
        ? cloneElement(triggerChild, triggerProps)
        : triggerChild;
    }
    if (isValidElement(child) && (child.type as FC).displayName === 'TooltipContent') {
      content = (child.props as { children: ReactNode }).children;
    }
  });

  return (
    <>
      {trigger}
      {isRendered &&
        createPortal(
          <div
            ref={tooltipRef}
            className={tooltipClassName}
            style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
            role="tooltip"
            id={tooltipId}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
});

Tooltip.displayName = 'Tooltip';
