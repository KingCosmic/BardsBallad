import { string } from 'zod';
import Button from '@components/inputs/Button';
import TextInput from '@components/inputs/TextInput';
import Modal from '@components/Modal';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import ModalHeader from '@components/Modal/Header';
import FileUpload from '@components/inputs/FileUpload';
import { useCallback, useState } from 'react';
import { closeModal } from '@state/modals';

type Props = {
  id: number
  title: string;
  onSave(importedJSON: any): void;
}

const ImportFile: React.FC<Props> = ({ id, title, onSave }) => {
  const [content, setContent] = useState<string>('')

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title}onClose={requestClose} />

      <ModalBody>
        <FileUpload id='upload' label='Upload file' onChange={setContent} />
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
          onClick={requestClose}
        >
          Cancel
        </Button>

        <Button color='primary' disabled={false} onClick={() => {
          onSave(content)
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ImportFile
