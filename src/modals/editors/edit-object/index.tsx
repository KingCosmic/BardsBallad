import { useCallback, useEffect, useState } from 'react';

import { produce } from 'immer'

import setNestedProperty from '@/utils/object/setNestedProperty'

import { Button } from '@/components/ui/button';
import { closeModal } from '@/state/modals';

import { type SystemType } from '@/db/system/schema'
import DynamicForm from '@/components/forms/dynamic-form'
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: any): void;

  id: number

  data: any;
  types: SystemType[];

  type?: string;
}

function EditObject({ id, title, onDelete, onSave, data, types, type }: ModalProps) {
  const [dataCopy, setDataCopy] = useState<{ [key:string]: any } | null>(null)

  const requestClose = useCallback(() => closeModal(id), [id])

  const setProperty = useCallback((path: string, value: any) => {
    setDataCopy(prev => produce(prev, draft => {
      // draft can be null if state was initialized as null; handle that
      if (!draft) {
        if (path) {
          const base: { [k:string]: any } = {}
          setNestedProperty(base, path, value)
          return base as any
        }

        return value as any
      }

      if (path) {
        setNestedProperty(draft, path, value)
      } else {
        return value as any
      }

      return draft
    }))
  }, [setDataCopy])

  useEffect(() => {
    setDataCopy(data || null)
  }, [data, setDataCopy])

  if (!dataCopy) return <Spinner />

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className='flex-1 min-h-0 overflow-auto'>
          {
            (type)
              ? <DynamicForm types={types} value={dataCopy} typeName={type} onChange={(p, v) => setProperty(p, v)} />
              : <DynamicForm types={types} value={dataCopy} typeName={dataCopy._type} onChange={(p, v) => setProperty(p, v)} />
          }
        </ScrollArea>
        <DialogFooter>
          <Button variant='destructive'
            onClick={() => {
              if (onDelete) onDelete()
              requestClose()
            }}
          >
            {(onDelete) ? 'Delete' : 'Close'}
          </Button>

          <Button color='primary' onClick={() => {         
            onSave(dataCopy)
            requestClose()
          }}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditObject