import { useCallback, useEffect, useState } from 'react';

import { produce } from 'immer'

import setNestedProperty from '@utils/setNestedProperty'
import generateObject from '@utils/generateObject'
import Divider from '@components/Divider';
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import TextInput from '@components/inputs/TextInput';
import Textarea from '@components/inputs/Textarea';
import Checkbox from '@components/inputs/Checkbox';
import Select from '@components/inputs/Select';
import { openModal } from '@state/modals';

import { type SystemType, type TypeData } from '@storage/schemas/system'
import BlueprintEditor from './BlueprintEditor';

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: any): void;

  requestClose(): void;

  isVisible: boolean;
  data: any;
  types: SystemType[];

  type?: string;
  typeData?: TypeData;
}

function EditObject({ title, onDelete, onSave, isVisible, data, types, type, requestClose, typeData }: ModalProps) {
  const [dataCopy, setDataCopy] = useState<{ [key:string]: any } | null>(null)

  const setProperty = (key: string, obj: { [key:string]: any }, value: any) => {
    setDataCopy(produce(obj, draft => {

      if (key) {
        setNestedProperty(draft, key, value)
      } else {
        draft = value
      }
    
      return draft
    }))
  }

  useEffect(() => {
    setDataCopy(data || null)
  }, [data, setDataCopy])

  if (!dataCopy) return <></>

  return (
    <Modal isOpen={isVisible} onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        {
          (type && typeData) ? RenderComponentFromType(types, type, dataCopy, dataCopy, typeData, '', setProperty)
          : GetComponentsFromTypeData(dataCopy, types, setProperty)
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


export function GetComponentsFromTypeData(dataCopy: any, types: SystemType[], setProperty: (key:string, obj:{ [key:string]: any }, value:any) => void) {
  return (
    <div>
      {
        (dataCopy._type as SystemType).properties.map((prop) => {
          const key = prop.key
          const data = dataCopy[key]

          const def = prop.typeData

          let type = def.type

          return (
            <div key={key}>
              {
                RenderComponentFromType(types, type, data, dataCopy, prop.typeData, key, setProperty)
              }
            </div>
          )
        })
      }
    </div>
  )
}


export function RenderComponentFromType(types: SystemType[], type: string, data: any, dataCopy: any, typeData: TypeData, label: string, setProperty: (path: string, obj: any, value: any) => void): React.ReactElement {
  
  const systemType = types.find(typeData => typeData.name === type)!

  if (type && typeData.isArray) {
    return (
      <ArrayEdit
        types={types}
        type={systemType}
        title={label}
        data={data}
        onAdd={(newItem) => setProperty(label, dataCopy, [ ...data, newItem ])}
        onChange={(path, newItems) => setProperty(path, dataCopy, newItems)}
        onDelete={(name) => setProperty(label, dataCopy, data.filter((item: any) => item.name !== name))}
      />
    )
  }

  switch (type) {
    case 'string':
      if (typeData.useTextArea) return <Textarea id={label} label={label} value={data} onChange={val => setProperty(label, dataCopy, val)} />
      return <TextInput id={label} label={label} isValid errorMessage='' value={data} onChange={val => setProperty(label, dataCopy, val)} />
    case 'number':
      return <TextInput id={label} label={label} isValid errorMessage='' value={data} onChange={val => setProperty(label, dataCopy, +val)} />
    case 'boolean':
      return <Checkbox id={label} label={label} checked={data} onChange={val => setProperty(label, dataCopy, val)} />
    case 'enum':
      return (
        <Select id={label} label={label} value={data} onChange={val => setProperty(label, dataCopy, val)}>
          {
            typeData.options?.map((option: string) => <option key={option} value={option}>{option}</option>)
          }
        </Select>
      )
    case 'blueprint':
      return (
        <Button key={label} color='light' onClick={() =>
          openModal('blueprint', ({ id }) => (
            <BlueprintEditor id={id} data={data} onSave={(bp) => setProperty(label, dataCopy, bp)} />
          ))}>Edit {label}</Button>
      )
    default:
      return (
        <div key={label} className='mb-2'>
          <p className='my-2'>{label}</p>
          <Divider />
          <div className='h-2' />
          {
            systemType.properties.map(prop => RenderComponentFromType(types, prop.typeData.type, data[prop.key] ?? '', dataCopy, prop.typeData, prop.key, (p, o, v) => {
              console.log(`${label}/${p}`)
              console.table(o)
              setProperty(`${label}/${p}`, o, v)
            }))
          }
        </div>
      )
  }
}

function ArrayEdit({ title, data, type, types, onAdd, onChange, onDelete }: { title: string; data: any[]; type: SystemType; types: SystemType[]; onAdd(data: any): void; onChange(path: string, value: any): void; onDelete(itemName:string): void; }) {
  const [editData, setEditData] = useState<any>(null)

  return (
    <div key={editData?.name} className='mt-3'>
      <EditObject
        types={types}
        title={`Edit ${editData?.name}`}
        onDelete={() => onDelete(editData?.name)}
        onSave={(item) => {
          const newItems = [ ...data ]

          const index = newItems.findIndex(v => v.name === editData?.name)

          newItems[index] = item

          onChange(`${title}`, newItems)
        }}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData}
      />


      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>{title}</p>

        <p onClick={() => onAdd(generateObject(types, type))}>
          Add
        </p>
      </div>

      <Divider />

      <div className='flex flex-col gap-1 mt-3'>
        {data.map(item => (
          <div key={item.name}
            className='p-3 border border-neutral-600 dark:bg-neutral-800 hover:bg-neutral-700 cursor-pointer'
            onClick={() => setEditData(item)}
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EditObject
