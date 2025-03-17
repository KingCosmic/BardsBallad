import { useEffect, useState } from 'react'
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import TextInput from '../components/inputs/TextInput';

type Props = {
  data: string | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: string): void;
  onDelete?(): void;
}

function EditStringModal({ data, title = 'Edit string', isOpen, requestClose, onSave, onDelete } : Props) {
  const [string, setString] = useState('')

  useEffect(() => {
    if (!data) return
  
    setString(data)
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title}onClose={requestClose} />

      <ModalBody>
        <TextInput id='name' label='Name' placeholder='baba yaga' value={string} onChange={setString} isValid errorMessage='' />
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
          onClick={() => {
            if (onDelete) onDelete()
            requestClose()
          }}
        >
          {(onDelete) ? 'Delete' : 'Close'}
        </Button>

        <Button color='primary' onClick={() => {
          if (!string) return requestClose()

          onSave(string)
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditStringModal