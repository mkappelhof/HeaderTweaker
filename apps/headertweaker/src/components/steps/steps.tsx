import { Children, type FC, isValidElement, type PropsWithChildren, useState } from 'react';
import { StepsProvider } from '@contexts/steps.context';

import css from './steps.module.scss';

export { FinalStep } from './elements/final-step';
export { Step } from './elements/step';
export { StepIndicators } from './elements/step-indicators';
export { StepNavigation, type StepNavigationProps } from './elements/step-navigation';

export type StepsProps = PropsWithChildren<{
  initialStep?: number;
}>;

export const Steps: FC<StepsProps> = ({ initialStep = 0, children }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const stepTitles: string[] = [];
  const stepDescriptions: (string | undefined)[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const displayName = (child.type as FC).displayName;
      if (displayName === 'Step' || displayName === 'FinalStep') {
        const { title, description } = child.props as { title?: string; description?: string };
        if (title) {
          stepTitles.push(title);
          stepDescriptions.push(description);
        }
      }
    }
  });

  const totalSteps = stepTitles.length;

  const handleStepChange = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <StepsProvider
      value={{
        currentStep,
        totalSteps,
        stepTitles,
        stepDescriptions,
        onStepChange: handleStepChange,
      }}
    >
      <div className={css.root}>{children}</div>
    </StepsProvider>
  );
};

Steps.displayName = 'Steps';
