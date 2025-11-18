import { useEffect, useState } from 'react'

import { BlueprintData } from '@/types/blueprint'

import { closeModal, openModal } from '@state/modals'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import TextInput from '@components/inputs/TextInput';
import Button from '@components/inputs/Button';
import ScriptEditor from './ScriptEditor';
import { Script } from '@/types/script';
import { SystemType } from '@storage/schemas/system';

type Props = {
  id: number;
  data: { name: string; icon: string; script: Script } | null;

  isOpen: boolean;
  types: SystemType[];
  globals: any[];
  onSave(newData: any): void;
  onDelete(): void;
}

function EditButtonModal({ id, types, globals, data, isOpen, onSave, onDelete }: Props) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [script, setScript] = useState<Script>(data?.script || {
    compiled: '',
    isCorrect: true,
    source: '',
    blueprint: { nodes: [], edges: [] }
  })

  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setIcon(data.icon)
    setScript(data.script)
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={() => closeModal(id)}>
      <ModalHeader title='Edit Button State' onClose={() => closeModal(id)} />

      <ModalBody>
        <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={name} onChange={(name) => setName(name)} isValid errorMessage='Names must be unique' />

        {/* TODO: Icon Select. */}

        <p onClick={() => {
          openModal('script', ({ id }) => (
            <ScriptEditor id={id} types={types} globals={globals} code={script} onSave={(script) => setScript(script.result)} expectedType='null' />
          ))
        }}>
          On Click Action
        </p>

      </ModalBody>

      <ModalFooter>
        <Button color='danger' onClick={() => {
          onDelete()
          closeModal(id)
        }}>Delete</Button>

        <Button color='primary' onClick={() => {         
          onSave({ name, icon, script })
          closeModal(id)
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditButtonModal
