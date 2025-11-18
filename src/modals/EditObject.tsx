import { useCallback, useEffect, useState } from 'react';

import { produce } from 'immer'

import setNestedProperty from '@utils/setNestedProperty'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import { closeModal } from '@state/modals';

import { type SystemType, type TypeData } from '@storage/schemas/system'
import DynamicForm from '../forms/DynamicForm'

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

  if (!dataCopy) return <></>

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        {
          (type)
            ? <DynamicForm types={types} value={dataCopy} typeName={type} onChange={(p, v) => setProperty(p, v)} />
            : <DynamicForm types={types} value={dataCopy} typeName={dataCopy._type} onChange={(p, v) => setProperty(p, v)} />
        }
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
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
      </ModalFooter>
    </Modal>
  )
}


// Removed inline render helpers; DynamicForm handles rendering now.

export default EditObject
