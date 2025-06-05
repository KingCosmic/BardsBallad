import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import TextInput from '@components/inputs/TextInput';
import { closeModal } from '@state/modals';

type Props = {
  id: number;
  data: string;
  title?: string;

  onSave(newData: string): void;
  onDelete?(): void;
}

function EditStringModal({ id, data, title = 'Edit string', onSave, onDelete } : Props) {
  const [string, setString] = useState(data)

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <TextInput id='name' label='String' placeholder='baba yaga' value={string} onChange={setString} isValid errorMessage='' />
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
          onClick={requestClose}
        >
          {(onDelete) ? 'Delete' : 'Close'}
        </Button>

        <Button color='primary' onClick={() => {
          if (!string) return

          onSave(string)
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditStringModal
