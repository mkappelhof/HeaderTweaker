import type { FC } from 'react';
import { Text } from '@components/text/text';
import { useStepsContext } from '@contexts/steps.context';
import classnames from 'clsx';

import css from '../steps.module.scss';

export const StepIndicators: FC = () => {
  const { currentStep, totalSteps, onStepChange, stepTitles } = useStepsContext();

  return (
    <div className={css.indicators}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={`step-indicator-${currentStep}-${
            // biome-ignore lint/suspicious/noArrayIndexKey: stfu
            index
          }`}
          className={css.indicatorWithLine}
        >
          <button
            type="button"
            onClick={() => onStepChange(index)}
            className={classnames(css.indicator, {
              [css.active]: index === currentStep,
              [css.completed]: index < currentStep,
            })}
            aria-label={`Go to step ${index + 1}${stepTitles[index] ? `: ${stepTitles[index]}` : ''}`}
            aria-current={index === currentStep ? 'step' : undefined}
          >
            <span className={css.indicatorNumber}>{index + 1}</span>
            {stepTitles[index] && (
              <Text variant="body-small" className={css.indicatorTitle}>
                {stepTitles[index]}
              </Text>
            )}
          </button>
          <div className={css.line} />
        </div>
      ))}
    </div>
  );
};
StepIndicators.displayName = 'StepIndicators';
