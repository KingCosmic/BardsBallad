import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { closeModal } from '@/state/modals';
import { useCallback, useState } from 'react'

type Props = {
  id: number;
  data: { local: any, remote: any }[];
  onSave(chars: any[]): void;
}

const HandleConflicts: React.FC<Props> = ({ id, data, onSave, }) => {
  const [conflictIndex, setConflictIndex] = useState(0)
  const [conflict, setConflict] = useState(data[0])

  const [chosenRevisions, setChosenRevisions] = useState<any[]>([])

  const requestClose = useCallback(() => closeModal(id), [id])

  const nextConflict = (chosen: any, remote: any) => {
    const updatedRevisions = [...chosenRevisions, { ...chosen, version: remote.version, updated_at: new Date().toISOString() }]
    setChosenRevisions(updatedRevisions)
    const newIndex = conflictIndex + 1

    if (newIndex >= data.length) {
      onSave(updatedRevisions)
      requestClose()
    } else {
      setConflictIndex(newIndex)
      setConflict(data[newIndex])
    }
  }

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {`Conflicts for Local:${conflict.local.name} / Remote:${conflict.remote.name}`}
          </DialogTitle>
          <DialogDescription>
            The time continuam? again?...
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="p-4">
            <p className="text-lg font-medium mb-2">Local</p>
            <p>Version: {conflict.local.version}</p>
            <p>Updated: {new Date(conflict.local.updated_at).toString()}</p>
            <p className="text-lg font-medium mb-2">Remote</p>
            <p>Version: {conflict.remote.version}</p>
            <p>Updated: {new Date(conflict.remote.updated_at).toString()}</p>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant='secondary' onClick={() => nextConflict(conflict.local, conflict.remote)}>
            Keep Local
          </Button>
          <Button onClick={() => nextConflict(conflict.remote, conflict.remote)}>
            Keep Remote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HandleConflicts