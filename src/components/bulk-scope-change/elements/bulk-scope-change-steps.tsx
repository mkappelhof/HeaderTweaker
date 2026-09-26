import type { FC } from 'react';
import { FinalStep, Step, StepIndicators, StepNavigation, Steps } from '@components/steps/steps';
import { useBulkScopeChangeContext } from '@contexts/bulk-scope-change.context';
import { useTranslation } from 'react-i18next';
import { SaveButton } from './save-button';
import { SelectHeaders } from './select-headers';
import { SelectUrls } from './select-urls';

type BulkScopeChangeStepsProps = {
  closeModal: () => void;
};

export const BulkScopeChangeSteps: FC<BulkScopeChangeStepsProps> = ({ closeModal }) => {
  const { t } = useTranslation();
  const { pendingHeaders } = useBulkScopeChangeContext();

  const selectedCount = Object.keys(pendingHeaders).length;

  return (
    <Steps>
      <StepIndicators />
      <Step
        title={t('title.scope.steps.headerSelect')}
        description={
          selectedCount
            ? t('label.scope.selectedCount', { count: selectedCount })
            : t('description.scope.steps.headerSelect')
        }
      >
        <SelectHeaders />
      </Step>
      <FinalStep
        title={t('title.scope.steps.scopeSelect')}
        description={t('description.scope.steps.scopeSelect')}
      >
        <SelectUrls />
      </FinalStep>
      <StepNavigation
        onCancel={closeModal}
        isNextDisabled={!selectedCount}
        finalPageButton={<SaveButton closeModal={closeModal} />}
      />
    </Steps>
  );
};
