import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { closeModal } from "@/state/modals";
import { useCallback, useState } from "react";

interface Props {
  id: number;
  data: string;
  title?: string;

  onSave(newData: string): void;
  onDelete?(): void;
}

export default function EditString({ id, data, title = 'Edit string', onSave, onDelete }: Props) {
  const [string, setString] = useState(data)

  const requestClose = useCallback(() => closeModal(id), [id])
  
  return (
    <Dialog open onOpenChange={requestClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input  placeholder='baba yaga' value={string} onChange={v => setString(v.currentTarget.value)} />
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
            onSave(string)
            requestClose()
          }}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}