import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import { closeModal } from '@/state/modals';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Props = {
  id: number
  title: string;
  onSave(importedJSON: any): void;
}

const ImportFile: React.FC<Props> = ({ id, title, onSave }) => {
  const [content, setContent] = useState<string>('')

  const requestClose = useCallback(() => closeModal(id), [id])

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setContent(content)
      }
      reader.readAsText(file)
    }
  }, [])

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Select file to import
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="picture">Picture</Label>
          <Input id="picture" type="file" onChange={handleFileChange} />
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={requestClose}>
            Cancel
          </Button>
          <Button color='primary' onClick={() => {
            onSave(content)
            requestClose()
          }}>
            Import File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ImportFile