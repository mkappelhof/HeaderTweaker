import type { Dispatch, FC, SetStateAction } from 'react';
import { Modal, ModalClose, ModalContent, ModalTitle } from '@components/modal/modal';
import { BulkScopeChangeProvider } from '@contexts/bulk-scope-change.context';
import { useTranslation } from 'react-i18next';
import { BulkScopeChangeSteps } from './elements/bulk-scope-change-steps';

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
          <BulkScopeChangeSteps closeModal={closeModal} />
        </BulkScopeChangeProvider>
      </ModalContent>
    </Modal>
  );
};
