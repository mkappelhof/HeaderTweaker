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

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const displayName = (child.type as FC).displayName;
      if (displayName === 'Step' || displayName === 'FinalStep') {
        const title = (child.props as { title?: string }).title;
        if (title) {
          stepTitles.push(title);
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
        onStepChange: handleStepChange,
      }}
    >
      <div className={css.root}>{children}</div>
    </StepsProvider>
  );
};

Steps.displayName = 'Steps';
