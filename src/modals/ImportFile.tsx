import { string } from 'zod';
import Button from '../components/inputs/Button';
import TextInput from '../components/inputs/TextInput';
import Modal from '../components/Modal';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import ModalHeader from '../components/Modal/Header';
import FileUpload from '../components/inputs/FileUpload';
import { useState } from 'react';

type Props = {
  title: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(importedJSON: any): void;
}

const ImportFile: React.FC<Props> = ({ isOpen, title, requestClose, onSave }) => {
  const [content, setContent] = useState<string>('')

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
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