import React, { useEffect, useState } from 'react'

import { produce } from 'immer'

import setNestedProperty from '@utils/setNestedProperty'
import generateObject from '@utils/generateObject'

import EditObject from './EditObject'
import Modal from '@components/Modal'
import ModalHeader from '@components/Modal/Header'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import TextInput from '@components/inputs/TextInput'
import Select from '@components/inputs/Select'
import Button from '@components/inputs/Button'
import Checkbox from '@components/inputs/Checkbox'
import Textarea from '@components/inputs/Textarea'
import { editorState } from '@state/editor'
import { useSystem } from '@hooks/useSystem'

import { type SystemType, type TypeData, type DataType, SystemData } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'

type ModalProps = {
  onDelete?(): void;
  onSave(newData: any): void;
  
  isVisible: boolean;
  data: DataType;
  types: SystemType[];
  requestClose(): void;
}

function EditSystemData({ types, onDelete, onSave, isVisible, requestClose, data }: ModalProps) {
  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  const [dataCopy, setDataCopy] = useState<DataType>({ name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, data: 'test' })

  const [type, setType] = useState<SystemType | null>(version?.data?.types.find(type => type.name === dataCopy.typeData.type) || null)

  const setProperty = (key:string, obj: DataType, value:any) => {
    setDataCopy(produce(obj, (draft: DataType) => {
      setNestedProperty(draft, key, value)

      return draft
    }))
  }

  useEffect(() => {
    const dc = data ? data : { name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [], outputType: 'none', isOutputAnArray: false, inputs: [] }, data: 'test' }

    setDataCopy(dc)
    setType(version?.data?.types.find(type => type.name === dc.typeData.type) || null)
  }, [data, setDataCopy, setType])

  if (!data) return <></>

  return (
    <Modal isOpen={isVisible} onClose={requestClose}>
      <ModalHeader title={`Edit ${data.name}`} onClose={requestClose} />

      <ModalBody>
        <TextInput id='data-name' label='Name' isValid errorMessage='' value={dataCopy.name} onChange={val => setDataCopy({...dataCopy, name: val })} />

        {/* <div className='h-4' /> */}

        <Select id='data-type' label='Type' value={type?.name || ''} onChange={val => {
          const t = version?.data?.types.find(type => type.name === val) || null

          setType(t)
          setDataCopy({ ...dataCopy, data: dataCopy.typeData.isArray ? [] : generateObject(types, t || val), typeData: { ...dataCopy.typeData, type: val } })
        }}>
          <option value='string'>string</option>
          
          <option value='number'>number</option>
          
          <option value='boolean'>boolean</option>
          
          <option value='enum'>enum</option>

          {version?.data?.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
        </Select>

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

        {
          (type && dataCopy.typeData.isArray) ? (
            <ArrayEdit
              types={types}
              type={type}
              title='data'
              data={dataCopy.data}
              onAdd={(newItem) => {
                console.log('adding item')
                setProperty('data', dataCopy, [ ...dataCopy.data, newItem ])
              }}
              onChange={(path, newItemData) => setProperty(path, dataCopy, newItemData)}
              onDelete={(name) => setProperty('data', dataCopy, dataCopy.data.filter((item: any) => item.name !== name))}
            />
          ) : (
            getComponentFromType(type || { name: dataCopy.typeData.type, properties: [] }, dataCopy.data || dataCopy, dataCopy, dataCopy.typeData, 'value', setProperty)
          )
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

function getComponentFromType(type: SystemType, data: any, dataCopy: any, typeData: TypeData, label: string, setProperty: (path: string, obj: any, value: any) => void): React.ReactElement {
  switch (type.name) {
    case 'string':
      if (typeData.useTextArea) return <Textarea id={label} label={label} value={data} onChange={val => setProperty('data', dataCopy, val)} />
      return <TextInput id={label} label={label} isValid errorMessage='' value={data} onChange={val => setProperty('data', dataCopy, val)} />
    case 'number':
      return <TextInput id={label} label={label} isValid errorMessage='' value={data} onChange={val => setProperty('data', dataCopy, +val)} />
    case 'boolean':
      return <Checkbox id={label} label={label} checked={data} onChange={val => setProperty('data', dataCopy, val)} />
    case 'enum':
      return (
        <Select id={label} label={label} value={data} onChange={val => setProperty('data', dataCopy, val)}>
          {
            typeData.options?.map((option: string) => <option key={option} value={option}>{option}</option>)
          }
        </Select>
      )
    case 'blueprint':
      return (
        <div>
          TODO
        </div>
      )
    default:
      return (
        <div key={label}>
          {
            type.properties.map(prop => getComponentFromType({ name: prop.typeData.type, properties: [] }, data[prop.key] || '', dataCopy, prop.typeData, prop.key, (p, o, v) => {
              setProperty(`data/${prop.key}`, o, v)
            }))
          }
        </div>
      )
  }
}

function ArrayEdit({ types, title, data, type, onAdd, onChange, onDelete }: { types: SystemType[], title: string; data: any[]; type: SystemType; onAdd(data: any): void; onChange(path: string, value: any): void; onDelete(itemName:string): void; }) {
  const [editData, setEditData] = useState<any>(null)

  return (
    <div>
      <EditObject
        title='Edit Data'
        types={types}
        onDelete={() => onDelete(editData.name)}
        onSave={(item) => onChange(`${title}/${editData.name}`, item)}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData}
      />

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>{title}</p>

        <p onClick={() => onAdd(generateObject(types, type))}>Add</p>
      </div>

      <p style={{ height: 1, width: '100%', backgroundColor: 'white', marginTop: 4, marginBottom: 4 }} />

      <div className='flex flex-col gap-1 mt-3'>
        {data.map((item) => {
          return (
            <div key={item.name}
              className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
              onClick={() => setEditData(item)}
            >
              <p>{item.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EditSystemData
