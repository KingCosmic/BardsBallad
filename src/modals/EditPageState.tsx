import { useEffect, useState } from 'react'

import { systemState, updatePageState } from '../state/system'
import { TypeData } from '../state/systems';
import { editorState } from '../state/editor';
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import TextInput from '../components/inputs/TextInput';
import Select from '../components/inputs/Select';
import Checkbox from '../components/inputs/Checkbox';

type Props = {
  data: { name: string, type: TypeData } | null;

  isOpen: boolean;
  requestClose(): void;
}

function EditPageStateModal({ data, isOpen, requestClose }: Props) {

  const system = systemState.useValue()
  const editor = editorState.useValue()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [isArray, setIsArray] = useState(false)

  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setType(data.type.type)
    setIsArray(data.type.isArray || false)
  }, [data])

  if (!system) return <></>

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Add Page State' onClose={requestClose} />

      <ModalBody>
        <TextInput id='var-name' label='Variable Name' value={name} onChange={setName} isValid errorMessage='' />

        <Select id='var-type' label='Type' value={type} onChange={setType}>
          {system.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
        </Select>

        <Checkbox id='is-array' label='Is Array?' checked={isArray} onChange={setIsArray} />
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={() => {
          if (!name) return requestClose()
          if (!type) return requestClose()
          if (!data) return requestClose()

          const newStateData: { name: string, type: TypeData } = {
            name,
            type: {
              type,
              isArray,
              useTextArea: false,
              options: []
            }
          }

          updatePageState(editor.page, data.name, newStateData)
          
          requestClose()
        }}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditPageStateModal