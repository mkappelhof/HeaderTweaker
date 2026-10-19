import type { FC, PropsWithChildren } from 'react';

export type TooltipTriggerProps = PropsWithChildren<Record<never, never>>;

const TooltipTrigger: FC<TooltipTriggerProps> = ({ children }) => <>{children}</>;

TooltipTrigger.displayName = 'TooltipTrigger';

export { TooltipTrigger };
