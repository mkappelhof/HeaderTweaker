import type { FC, ReactNode } from 'react';
import { Button } from '@components/button/button';
import { Text } from '@components/text/text';
import { useStepsContext } from '@contexts/steps.context';

import css from '../steps.module.scss';

export type StepNavigationProps = {
  finalPageButton?: ReactNode;
};

export const StepNavigation: FC<StepNavigationProps> = ({ finalPageButton }) => {
  const { currentStep, totalSteps, onStepChange } = useStepsContext();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const handlePrevious = () => {
    if (!isFirstStep) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <div className={css.navigation}>
      <Button onClick={handlePrevious} disabled={isFirstStep} variant="ghost">
        Previous
      </Button>
      <Text className={css.stepCounter}>
        Step {currentStep + 1} of {totalSteps}
      </Text>
      {isLastStep && finalPageButton !== undefined ? (
        finalPageButton
      ) : (
        <Button onClick={handleNext} disabled={isLastStep} variant="ghost">
          Next
        </Button>
      )}
    </div>
  );
};

StepNavigation.displayName = 'StepNavigation';
