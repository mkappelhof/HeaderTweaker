import type { ReactNode } from 'react';

const ModalFooter = ({ children }: { children: ReactNode }) => {
  return <div className="modal-footer">{children}</div>;
};

ModalFooter.displayName = 'ModalFooter';

export { ModalFooter };
