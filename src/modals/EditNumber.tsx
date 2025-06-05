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
  data: string | null;
  title?: string;

  onSave(newData: string): void;
}

function EditNumberModal({ id, data, title = 'Edit Number', onSave } : Props) {
  const [string, setString] = useState('')

  useEffect(() => {
    if (!data) return
  
    setString(data)
  }, [data])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <TextInput type='number' id='name' label='Name' placeholder='baba yaga' value={string} onChange={setString} isValid errorMessage='' />
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
          onClick={requestClose}>
          Delete
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

export default EditNumberModal
