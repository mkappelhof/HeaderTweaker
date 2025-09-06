import type { ReactNode } from 'react';

const ModalContent = ({ children }: { children: ReactNode }) => {
  return <div className="modal-content">{children}</div>;
};

ModalContent.displayName = 'ModalContent';

export { ModalContent };
