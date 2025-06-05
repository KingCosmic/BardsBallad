import { useState } from 'react'
import Button from '@components/inputs/Button'
import Modal from '@components/Modal'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import ModalHeader from '@components/Modal/Header'

type Props = {
  data: { local: any, remote: any }[];
  onSave(chars: any[]): void;
}

const HandleConflicts: React.FC<Props> = ({ data, onSave, }) => {
  console.log(data)

  const [conflictIndex, setConflictIndex] = useState(0)
  const [conflict, setConflict] = useState(data[0])

  const [chosenRevisions, setChosenRevisions] = useState<any[]>([])

  const nextConflict = (chosen: any, remote: any) => {
    const updatedRevisions = [...chosenRevisions, { ...chosen, version: remote.version, updated_at: new Date().toISOString() }]
    setChosenRevisions(updatedRevisions)
    const newIndex = conflictIndex + 1

    if (newIndex >= data.length) {
      onSave(updatedRevisions)
    } else {
      setConflictIndex(newIndex)
      setConflict(data[newIndex])
    }
  }

  return (
    <Modal isOpen>
      <ModalHeader title={`Conflicts for Local:${conflict.local.name} / Remote:${conflict.remote.name}`} />

      <ModalBody className="text-center">
        <div className="p-4">
          <p className="text-lg font-medium mb-2">Local</p>
          <p>Version: {conflict.local.version}</p>
          <p>Updated: {new Date(conflict.local.updated_at).toString()}</p>
          <p className="text-lg font-medium mb-2">Remote</p>
          <p>Version: {conflict.remote.version}</p>
          <p>Updated: {new Date(conflict.remote.updated_at).toString()}</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={() => nextConflict(conflict.local, conflict.remote)}>
          Keep Local
        </Button>
        <Button color='primary' onClick={() => nextConflict(conflict.remote, conflict.remote)}>
          Keep Remote
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default HandleConflicts
