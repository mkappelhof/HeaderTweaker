import type { ReactNode } from 'react';

export interface TooltipContentProps {
  children: ReactNode;
}

const TooltipContent = ({ children }: TooltipContentProps) => {
  return <>{children}</>;
};
TooltipContent.displayName = 'TooltipContent';

export { TooltipContent };
