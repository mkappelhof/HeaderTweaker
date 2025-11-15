import type { ReactNode } from 'react';

export interface TooltipTriggerProps {
  children: ReactNode;
}

const TooltipTrigger = ({ children }: TooltipTriggerProps) => {
  return <>{children}</>;
};

TooltipTrigger.displayName = 'TooltipTrigger';

export { TooltipTrigger };
