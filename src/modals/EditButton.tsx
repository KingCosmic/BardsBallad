import { useEffect, useState } from 'react'

import { BlueprintData } from '@/types/blueprint'

import { openModal } from '@state/modals'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import TextInput from '@components/inputs/TextInput';
import Button from '@components/inputs/Button';
import BlueprintEditor from './BlueprintEditor';

type Props = {
  data: { name: string; icon: string; blueprint: BlueprintData } | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: any): void;
  onDelete(): void;
}

function EditButtonModal({ data, isOpen, requestClose, onSave, onDelete }: Props) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [blueprint, setBlueprint] = useState<BlueprintData>({ nodes: [], edges: [] })

  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setIcon(data.icon)
    setBlueprint(data.blueprint)
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Edit Button State' onClose={requestClose} />

      <ModalBody>
        <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={name} onChange={(name) => setName(name)} isValid errorMessage='Names must be unique' />

        {/* TODO: Icon Select. */}

        <p onClick={() =>
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={blueprint} onSave={(bp) => setBlueprint(bp)} />
          ))
        }>
          On Click Action
        </p>

      </ModalBody>

      <ModalFooter>
        <Button color='danger' onClick={() => {
          onDelete()
          requestClose()
        }}>Delete</Button>

        <Button color='primary' onClick={() => {         
          onSave({ name, icon, blueprint })
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditButtonModal
