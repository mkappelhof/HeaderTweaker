import type { FC, PropsWithChildren } from 'react';
import { useStepsContext } from '@contexts/steps.context';

import css from '../steps.module.scss';

export type FinalStepProps = PropsWithChildren<{
  title: string;
}>;

export const FinalStep: FC<FinalStepProps> = ({ title, children }) => {
  const { stepTitles, currentStep } = useStepsContext();

  const stepIndex = stepTitles.indexOf(title);

  if (stepIndex === -1) {
    console.warn(`FinalStep with title "${title}" not found`);
    return null;
  }

  if (currentStep !== stepIndex) {
    return null;
  }

  return <div className={css.content}>{children}</div>;
};

FinalStep.displayName = 'FinalStep';
