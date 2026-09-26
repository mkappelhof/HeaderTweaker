import type { FC, ReactNode } from 'react';
import { Button } from '@components/button/button';
import { Text } from '@components/text/text';
import { useStepsContext } from '@contexts/steps.context';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

import css from '../steps.module.scss';

export type StepNavigationProps = {
  finalPageButton?: ReactNode;
  isNextDisabled?: boolean;
  onCancel?: () => void;
};

export const StepNavigation: FC<StepNavigationProps> = ({
  finalPageButton,
  isNextDisabled = false,
  onCancel,
}) => {
  const { t } = useTranslation();
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
      {isFirstStep ? (
        onCancel && (
          <Button onClick={onCancel} variant="ghost">
            <Text as="span">{t('button.feedback.cancel')}</Text>
          </Button>
        )
      ) : (
        <Button onClick={handlePrevious} variant="ghost">
          <ArrowLeftIcon />
          <Text as="span">{t('label.previous')}</Text>
        </Button>
      )}
      <div className={css.navigationEnd}>
        {isLastStep && finalPageButton !== undefined ? (
          finalPageButton
        ) : (
          <Button onClick={handleNext} disabled={isLastStep || isNextDisabled}>
            <Text as="span">{t('label.next')}</Text>
            <ArrowRightIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

StepNavigation.displayName = 'StepNavigation';
