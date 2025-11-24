import React, { useCallback, useEffect, useState } from 'react'

import { produce } from 'immer'

import setNestedProperty from '@utils/setNestedProperty'
import generateObject from '@utils/generateObject'

import DynamicForm from '../forms/DynamicForm'
import Modal from '@components/Modal'
import ModalHeader from '@components/Modal/Header'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import TextInput from '@components/inputs/TextInput'
import TypeSelect from '@components/inputs/TypeSelect'
import Button from '@components/inputs/Button'
import Checkbox from '@components/inputs/Checkbox'

import { type SystemType, type DataType } from '@storage/schemas/system'
import { closeModal } from '@state/modals'

type ModalProps = {
  id: number;
  onDelete?(): void;
  onSave(newData: any): void;
  
  data: DataType;
  types: SystemType[];
}

function EditSystemData({ id, types, onDelete, onSave, data }: ModalProps) {
  const [dataCopy, setDataCopy] = useState<DataType>({ name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, data: 'test' })

  const [type, setType] = useState<string>(dataCopy.typeData.type)

  const setProperty = (key:string, obj: DataType, value:any) => {
    console.log(key)
    setDataCopy(produce(obj, (draft: DataType) => {
      setNestedProperty(draft, key, value)

      return draft
    }))
  }

  useEffect(() => {
    const dc = data ? data : { name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, data: 'test' }

    if (
      dc.name === dataCopy.name
      &&
      dc.typeData.type === type
    ) return

    setDataCopy(dc)
    setType(dc.typeData.type)
  }, [data, setDataCopy, setType])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={`Edit ${data.name}`} onClose={requestClose} />

      <ModalBody>
        <TextInput id='data-name' label='Name' isValid errorMessage='' value={dataCopy.name} onChange={val => setDataCopy({...dataCopy, name: val })} />

        {/* <div className='h-4' /> */}

        <TypeSelect id='data-type' label='Type' types={types} value={type} onChange={val => {
          const t = types.find(type => type.name === val) || null

          setType(val)
          setDataCopy({ ...dataCopy, data: dataCopy.typeData.isArray ? [] : generateObject(types, t || val), typeData: { ...dataCopy.typeData, type: val } })
        }} />

        {
          type && (
            <div>
              <Checkbox id='is-array' label='Is Array?' checked={dataCopy.typeData.isArray} onChange={isArray => {
                if (isArray) {
                  setDataCopy({ ...dataCopy, data: [], typeData: { ...dataCopy.typeData, isArray }})
                } else {
                  setDataCopy({ ...dataCopy, data: generateObject(types, dataCopy.typeData.type), typeData: { ...dataCopy.typeData, isArray }})
                }
              }} />
            </div>
          )
        }

        <div className='h-2' />

        <DynamicForm
          types={types}
          value={dataCopy.data}
          typeName={type}
          basePath='data'
          typeData={dataCopy.typeData}
          onChange={(path: string, val: any) => setProperty(path, dataCopy, val)}
        />
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

// Using shared DynamicForm and modal-level ArrayEdit; local helpers removed to reduce duplication.

export default EditSystemData
