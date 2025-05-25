import React from 'react'
import Button from '@components/inputs/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import ModalHeader from '@components/Modal/Header'

type Props = {
  data: { type: string, message: string };
  title: string;

  isOpen: boolean;
  requestClose(): void;
  onConfirm(val: any): void;
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  title,
  data,
  requestClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody className="text-center">
        <div className="p-4">
          <p className="text-lg font-medium mb-2">{data.message}</p>
          <p className="text-sm font-semibold text-red-500">This action cannot be undone.</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color={data.type} onClick={() => {
          onConfirm(undefined)
          requestClose()
        }}>Confirm</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal

