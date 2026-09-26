import { type FC, Fragment } from 'react';
import { Text } from '@components/text/text';
import { useStepsContext } from '@contexts/steps.context';
import { CheckIcon } from '@heroicons/react/24/solid';
import classnames from 'clsx';
import { useTranslation } from 'react-i18next';

import css from '../steps.module.scss';

export const StepIndicators: FC = () => {
  const { t } = useTranslation();
  const { currentStep, totalSteps, onStepChange, stepTitles, stepDescriptions } = useStepsContext();

  return (
    <ol className={css.indicators}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <Fragment
            key={`step-indicator-${
              // biome-ignore lint/suspicious/noArrayIndexKey: steps never reorder
              index
            }`}
          >
            <li className={css.indicatorItem}>
              <button
                type="button"
                onClick={() => onStepChange(index)}
                disabled={index > currentStep}
                className={classnames(css.indicator, {
                  [css.active]: isActive,
                  [css.completed]: isCompleted,
                })}
                aria-label={
                  stepTitles[index]
                    ? t('a11y.ariaLabel.steps.goToStepTitled', {
                        number: index + 1,
                        title: stepTitles[index],
                      })
                    : t('a11y.ariaLabel.steps.goToStep', { number: index + 1 })
                }
                aria-current={isActive ? 'step' : undefined}
              >
                <span className={css.indicatorNumber} aria-hidden="true">
                  {isCompleted ? <CheckIcon /> : index + 1}
                </span>
                {stepTitles[index] && (
                  <span className={css.indicatorText}>
                    <Text as="span" className={css.indicatorTitle}>
                      {stepTitles[index]}
                    </Text>
                    {stepDescriptions[index] && (
                      <Text as="span" variant="body-small" className={css.indicatorDescription}>
                        {stepDescriptions[index]}
                      </Text>
                    )}
                  </span>
                )}
              </button>
            </li>
            {index < totalSteps - 1 && (
              <li
                aria-hidden="true"
                className={classnames(css.line, { [css.completed]: isCompleted })}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
};
StepIndicators.displayName = 'StepIndicators';
