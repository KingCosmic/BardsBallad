import { useEffect, useState } from 'react'
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import TextInput from '../components/inputs/TextInput';
import Select from '../components/inputs/Select';

type Props = {
  data: string | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: any): void;
  onDelete?(): void;
}

const CreateSubscriptionModal: React.FC<Props> = ({ data, title, isOpen, requestClose, onSave, onDelete }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState('system')

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Create Subscription' onClose={requestClose} />

      <ModalBody>
        <TextInput id='name' label='Name' placeholder='baba yaga' value={name} onChange={setName} isValid errorMessage='' />

        <Select id='susbcription-type' label='Type' value={type} onChange={setType}>
          <option value='system'>System</option>
          <option value='datapack' disabled>Data Pack</option>
          <option value='theme' disabled>Theme</option>
        </Select>
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={() => {
          onSave({
            name,
            type
          })
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateSubscriptionModal