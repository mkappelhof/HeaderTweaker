import type { FC, PropsWithChildren } from 'react';

export type TooltipContentProps = PropsWithChildren<Record<never, never>>;

const TooltipContent: FC<TooltipContentProps> = ({ children }) => {
  return <>{children}</>;
};

TooltipContent.displayName = 'TooltipContent';

export { TooltipContent };