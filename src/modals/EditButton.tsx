import { useEffect, useState } from 'react'

import { BlueprintData } from '@/types/blueprint'

import { openModal } from '@state/modals'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import TextInput from '@components/inputs/TextInput';
import Button from '@components/inputs/Button';
import ScriptEditor from './ScriptEditor';

type Props = {
  data: { name: string; icon: string; script: string } | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: any): void;
  onDelete(): void;
}

function EditButtonModal({ data, isOpen, requestClose, onSave, onDelete }: Props) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [script, setScript] = useState<string>('')

  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setIcon(data.icon)
    setScript(data.script)
  }, [data])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Edit Button State' onClose={requestClose} />

      <ModalBody>
        <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={name} onChange={(name) => setName(name)} isValid errorMessage='Names must be unique' />

        {/* TODO: Icon Select. */}

        <p onClick={() => {
          // openModal('blueprint', ({ id }) => (
          //   <BlueprintEditor id={id} data={blueprint} onSave={(bp) => setBlueprint(bp)} />
          // ))
          openModal('script', ({ id }) => (
            <ScriptEditor id={id} code={script} onSave={(script) => setScript(script)} />
          ))
        }}>
          On Click Action
        </p>

      </ModalBody>

      <ModalFooter>
        <Button color='danger' onClick={() => {
          onDelete()
          requestClose()
        }}>Delete</Button>

        <Button color='primary' onClick={() => {         
          onSave({ name, icon, script })
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditButtonModal
