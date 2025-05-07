import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import Select from '../components/inputs/Select';
import { useEffect, useState } from 'react';
import { useOurSystems } from '../hooks/useOurSystems';
import Textarea from '../components/inputs/Textarea';
import Checkbox from '../components/inputs/Checkbox';

type Props = {
  data: string | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(data: {
    name: string
    description: string
    
    resource_type: string
    resource_id: string

    is_public: boolean
  }): void;
}

const PublishNewSystem: React.FC<Props> = ({ data, isOpen, requestClose, onSave }) => {
  const { systems, isLoading: isSystemsLoading } = useOurSystems()

  const [selectedSystem, setSelectedSystem] = useState(systems[0])

  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    if (!systems) return

    setSelectedSystem(systems[0])
  }, [systems])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Publish New System' onClose={requestClose} />

      <ModalBody>
        <Select id='system-to-publish' label='System' value={selectedSystem?.local_id} onChange={val => setSelectedSystem(systems.find(sys => sys.local_id === val)!)}>
          {systems.map(sys => (
            <option value={sys.local_id}>{sys.name}</option>
          ))}
        </Select>
        
        <Textarea id='description' label='Description' value={description} onChange={setDescription} />

        <Checkbox id='is-public' label='Is public?' checked={isPublic} onChange={setIsPublic} />
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' onClick={() => {
          onSave({
            name: selectedSystem.name,
            description: description,
            resource_id: selectedSystem.local_id,
            resource_type: 'system',
            is_public: isPublic
          })
          requestClose()
        }}>Publish</Button>
      </ModalFooter>
    </Modal>
  )
}

export default PublishNewSystem