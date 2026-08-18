import type { Dispatch, FC, SetStateAction } from 'react';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@components/modal/modal';
import { FinalStep, Step, StepIndicators, StepNavigation, Steps } from '@components/steps/steps';
import { BulkScopeChangeProvider } from '@contexts/bulk-scope-change.context';
import { SaveButton } from './elements/save-button';
import { SelectHeaders } from './elements/select-headers';
import { SelectUrls } from './elements/select-urls';

type BulkScopeChangeProps = {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
};

export const BulkScopeChange: FC<BulkScopeChangeProps> = ({ showModal, setShowModal }) => {
  const closeModal = () => setShowModal(false);

  return (
    <Modal withFullHeight type="modal" isOpen={showModal} onClose={closeModal}>
      <ModalTitle>Set URL restrictions</ModalTitle>
      <ModalClose onClose={closeModal} />
      <ModalContent>
        <BulkScopeChangeProvider>
          <Steps>
            <StepIndicators />
            <Step title="Select headers">
              <SelectHeaders />
            </Step>
            <FinalStep title="Set URLs">
              <SelectUrls />
            </FinalStep>
            <StepNavigation finalPageButton={<SaveButton />} />
          </Steps>
        </BulkScopeChangeProvider>
      </ModalContent>
    </Modal>
  );
};
