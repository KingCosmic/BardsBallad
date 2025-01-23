import { useRef, useState } from 'react'

import { createCharacter } from '../state/characters'
import { SystemData, systemsState } from '../state/systems'
import TextInput from '../components/inputs/TextInput'
import Select from '../components/inputs/Select'
import Modal from '../components/Modal'
import ModalHeader from '../components/Modal/Header'
import ModalBody from '../components/Modal/Body'
import ModalFooter from '../components/Modal/Footer'
import Button from '../components/inputs/Button'

function CharacterCreatorModal(props: any) {
  const systems = systemsState.useValue()

  const [name, setName] = useState('')
  const [system, setSystem] = useState<SystemData | undefined>(systems[0])

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader title='Create Character' onClose={() => props.setIsOpen(false)} />

      <ModalBody>
        <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={name} onChange={(name) => setName(name)} isValid errorMessage='Names must be unique' />

        <Select id='character-system' label='Tabletop System' value={system?.name || ''} onChange={(name) => setSystem(systems.find(s => s.name === name))}>
          {systems.map((sys) => <option key={sys.name} value={sys.name}>{sys.name}</option>)}
        </Select>
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={() => {
          if (!system || !name) return

          createCharacter(name, system)
          setName('')
          setSystem(systems[0])
          props.setIsOpen(false)
        }}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default CharacterCreatorModal