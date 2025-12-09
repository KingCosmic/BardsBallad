import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { closeModal } from "@/state/modals";
import { useCallback, useState } from "react";

interface Props {
  id: number;
  data: number;
  title?: string;

  onSave(newData: number): void;
  onDelete?(): void;
}

export default function EditNumber({ id, data, title = 'Edit number', onSave, onDelete }: Props) {
  const [number, setNumber] = useState(data)

  const requestClose = useCallback(() => closeModal(id), [id])
  
  return (
    <Dialog open onOpenChange={requestClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input type='number' placeholder='baba yaga' value={number} onChange={v => setNumber(v.currentTarget.valueAsNumber)} />
        </DialogBody>
        <DialogFooter>
          <Button variant={onDelete ? 'destructive' : 'outline'}
            onClick={() => {
              if (onDelete) onDelete()
              requestClose()
            }}
          >
            {(onDelete) ? 'Delete' : 'Close'}
          </Button>

          <Button color='primary' onClick={() => {         
            onSave(number)
            requestClose()
          }}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}