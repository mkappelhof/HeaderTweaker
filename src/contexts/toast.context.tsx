import {
  createContext,
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useState,
} from 'react';
import type { ToastItemProps } from '@components/toast/toast-item';

type ToastEntry = {
  id: string;
  node: ReactElement<ToastItemProps>;
};

type ToastContextValue = {
  toasts: ReadonlyArray<ToastEntry>;
  addToast: (node: ReactElement<ToastItemProps>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const addToast = (node: ReactElement<ToastItemProps>) => {
    setToasts((current) => [...current, { id: crypto.randomUUID(), node }]);
  };

  const removeToast = (id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = (): ToastContextValue => {
  const context = useContext(ToastContext);

  if (!context) throw new Error('useToastContext must be used within a ToastProvider');

  return context;
};
