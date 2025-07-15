import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';

import { closeModal, openModal } from '@state/modals';

type Props = {
  id: number;
  type: 'datapack' | 'character' | 'system' | 'theme';
  ImportModal: React.FC<{ id: number }>;
  CreateModal: React.FC<{ id: number }>;
}

function ImportOrCreateModal({ id, type, ImportModal, CreateModal } : Props) {
  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Import Or Create?' onClose={requestClose} />

      <ModalBody>
        <p>Would you like to import or create a {type}?</p>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={() => {
          openModal(`import-${type}`, ({ id }) => <ImportModal id={id} />)
          requestClose()
        }}>
          Import
        </Button>

        <Button color='light' onClick={() => {
          openModal(`create-${type}`, ({ id }) => <CreateModal id={id} />)
          requestClose()
        }}>Create</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ImportOrCreateModal