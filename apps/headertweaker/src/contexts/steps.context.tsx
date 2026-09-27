import { createContext, type FC, type PropsWithChildren, useContext } from 'react';

export type StepsContextValue = {
  currentStep: number;
  totalSteps: number;
  onStepChange: (stepIndex: number) => void;
  stepTitles: string[];
};

export const StepsContext = createContext<StepsContextValue | undefined>(undefined);

type StepsProviderProps = {
  value: StepsContextValue;
};

export const StepsProvider: FC<PropsWithChildren<StepsProviderProps>> = ({ value, children }) => {
  return <StepsContext.Provider value={value}>{children}</StepsContext.Provider>;
};

export const useStepsContext = (): StepsContextValue => {
  const context = useContext(StepsContext);

  if (!context) {
    throw new Error('useStepsContext must be used within a StepsProvider');
  }

  return context;
};
