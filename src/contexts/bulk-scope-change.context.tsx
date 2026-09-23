import {
  createContext,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react';
import type { Header } from '@interfaces/index';

export type PendingHeader = Record<Header['id'], string[]>;

export type BulkScopeChangeContextValue = {
  error: string | undefined;
  setError: Dispatch<SetStateAction<string | undefined>>;
  isCompleted: boolean;
  setIsCompleted: Dispatch<SetStateAction<boolean>>;
  pendingHeaders: PendingHeader;
  setPendingHeaders: Dispatch<SetStateAction<PendingHeader>>;
};

export const BulkScopeChangeContext = createContext<BulkScopeChangeContextValue | undefined>(
  undefined
);

export const BulkScopeChangeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [error, setError] = useState<string>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [pendingHeaders, setPendingHeaders] = useState<PendingHeader>({});

  return (
    <BulkScopeChangeContext.Provider
      value={{ error, setError, isCompleted, setIsCompleted, pendingHeaders, setPendingHeaders }}
    >
      {children}
    </BulkScopeChangeContext.Provider>
  );
};

export const useBulkScopeChangeContext = (): BulkScopeChangeContextValue => {
  const context = useContext(BulkScopeChangeContext);

  if (!context) {
    throw new Error('useBulkScopeChangeContext must be used within a BulkScopeChangeProvider');
  }

  return context;
};
