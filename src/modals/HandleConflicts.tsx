import { useState } from 'react'
import Button from '../components/inputs/Button'
import Modal from '../components/Modal'
import ModalBody from '../components/Modal/Body'
import ModalFooter from '../components/Modal/Footer'
import ModalHeader from '../components/Modal/Header'
import { type Character } from '../storage/schemas/character'

type Props = {
  data: { local: Character, remote: Character }[] | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(chars: Character[]): void;
}

const HandleConflicts: React.FC<Props> = ({ data, isOpen, requestClose, onSave, }) => {
  if (!isOpen) return null
  if (!data) return null
  if (data.length === 0) return null

  const [conflictIndex, setConflictIndex] = useState(0)
  const [conflict, setConflict] = useState(data[0])

  const [chosenRevisions, setChosenRevisions] = useState<Character[]>([])

  const nextCharacter = (char: Character) => {
    setChosenRevisions([...chosenRevisions, char])
    const newIndex = conflictIndex + 1
    setConflictIndex(newIndex)
    setConflict(data[newIndex])

    if (newIndex >= data.length) {
      onSave(chosenRevisions)
      requestClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={`Conflicts for Local:${conflict.local.name} / Remote:${conflict.remote.name}`} onClose={requestClose} />

      <ModalBody className="text-center">
        <div className="p-4">
          <p className="text-lg font-medium mb-2">Local last updated {conflict.local.updatedAt}</p>
          <p className="text-lg font-medium mb-2">Remote last updated {conflict.remote.updatedAt}</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={() => nextCharacter(conflict.local)}>
          Keep Local
        </Button>
        <Button color='primary' onClick={() => nextCharacter(conflict.remote)}>
          Keep Remote
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default HandleConflicts