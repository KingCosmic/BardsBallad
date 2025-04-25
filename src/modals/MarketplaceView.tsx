import { useEffect, useState } from 'react'
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import Checkbox from '../components/inputs/Checkbox';
import Select from '../components/inputs/Select';

type Props = {
  data: { name: string, description: string, version: string } | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: string): void;
  onDelete?(): void;
}

const MarketplaceViewModal: React.FC<Props> = ({ data, title = 'Edit string', isOpen, requestClose, onSave, onDelete } : Props) => {
  const [autoUpdate, setAutoUpdate] = useState(true)

  if (!data) return null

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title}onClose={requestClose} />

      <ModalBody>
        <h1>{data.name}</h1>

        <h4>{data.description}</h4>

        <h4>Latest Version: {data.version}</h4>
      </ModalBody>

      <ModalFooter>
        <div className='flex items-center justify-between w-full'>
          <Button color='light' onClick={requestClose}>Exit</Button>

          <div className='flex flex-row justify-center gap-2'>
            <Checkbox id='auto-update' label='Auto Update' checked={true} onChange={() => {}} />

            <Select id='version' containerClassName='flex flex-row items-center gap-2' labelClassName='mb-0' label='Version' value='0' onChange={() => {}}>
              <option value='2.0.0'>2.0.0</option>
              <option value='0.8.3'>0.8.3</option>
              <option value='0.9.5'>0.9.5</option>
            </Select>

            <Button color='primary' onClick={() => {}}>
              Subscribe
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default MarketplaceViewModal