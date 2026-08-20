import type { Dispatch, FC, SetStateAction } from 'react';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@components/modal/modal';
import { FinalStep, Step, StepIndicators, StepNavigation, Steps } from '@components/steps/steps';
import { BulkScopeChangeProvider } from '@contexts/bulk-scope-change.context';
import { useTranslation } from 'react-i18next';
import { SaveButton } from './elements/save-button';
import { SelectHeaders } from './elements/select-headers';
import { SelectUrls } from './elements/select-urls';

type BulkScopeChangeProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export const BulkScopeChange: FC<BulkScopeChangeProps> = ({ showModal, setShowModal }) => {
  const { t } = useTranslation();
  const closeModal = () => setShowModal(false);

  return (
    <Modal withFullHeight type="modal" isOpen={showModal} onClose={closeModal}>
      <ModalTitle>{t('title.scope.wizard')}</ModalTitle>
      <ModalClose onClose={closeModal} />
      <ModalContent>
        <BulkScopeChangeProvider>
          <Steps>
            <StepIndicators />
            <Step title={t('title.scope.steps.headerSelect')}>
              <SelectHeaders />
            </Step>
            <FinalStep title={t('title.scope.steps.scopeSelect')}>
              <SelectUrls />
            </FinalStep>
            <StepNavigation finalPageButton={<SaveButton />} />
          </Steps>
        </BulkScopeChangeProvider>
      </ModalContent>
    </Modal>
  );
};
