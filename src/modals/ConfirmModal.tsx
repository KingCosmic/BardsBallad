import React, { useCallback } from 'react'
import Button from '@components/inputs/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import ModalHeader from '@components/Modal/Header'
import { closeModal } from '@state/modals'

type Props = {
  id: number;
  title: string;
  type: string;
  message: string;

  onConfirm(): void;
};

const ConfirmModal: React.FC<Props> = ({ id, title, type, message, onConfirm }) => {

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody className="text-center">
        <div className="p-4">
          <p className="text-lg font-medium mb-2">{message}</p>
          <p className="text-sm font-semibold text-red-500">
            This action cannot be undone.
          </p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          color={type}
          onClick={() => {
            onConfirm();
            requestClose();
          }}
        >
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
