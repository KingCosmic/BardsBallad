import React, { useEffect, useState } from 'react';
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonCheckbox,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react'

import { produce } from 'immer'

import setNestedProperty from '../utils/setNestedProperty';
import generateObject from '../utils/generateObject';
import { systemState } from '../state/system';
import { DataType, SystemType, TypeData } from '../state/systems';
import EditObject from './EditObject';

type ModalProps = {
  onDelete?(): void;
  onSave(newData: any): void;
  
  isVisible: boolean;
  data: DataType;
  types: SystemType[];
  requestClose(): void;
}

function EditSystemData({ types, onDelete, onSave, isVisible, requestClose, data }: ModalProps) {
  const system = systemState.useValue()

  const [dataCopy, setDataCopy] = useState<DataType>({ name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [] }, data: 'test' })

  const [type, setType] = useState<SystemType | null>(system?.types.find(type => type.name === dataCopy.typeData.type) || null)

  const setProperty = (key:string, obj: DataType, value:any) => {
    setDataCopy(produce(obj, draft => {
      setNestedProperty(draft, key, value)

      return draft
    }))
  }

  useEffect(() => {
    const dc = data ? data : { name: '', typeData: { type: 'string', useTextArea: false, isArray: false, options: [] }, data: 'test' }

    setDataCopy(dc)
    setType(system?.types.find(type => type.name === dc.typeData.type) || null)
  }, [data, setDataCopy, setType])

  if (!data) return <></>

  return (
    <IonModal isOpen={isVisible}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit {data.name}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={requestClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>

        <IonItem color='light'>
          <IonInput label='Name' labelPlacement='floating' value={dataCopy.name} onIonInput={(ev) => setDataCopy({ ...dataCopy, name: (ev.target as unknown as HTMLInputElement).value})} />
        </IonItem>

        <div style={{ height: 15 }} />

        <IonItem color='light'>
          <IonSelect label='Type' labelPlacement='floating' interface='popover'
            value={dataCopy.typeData.type}
            onIonChange={(e) => {
              const t = system?.types.find(type => type.name === e.detail.value) || null
              setType(t)
              setDataCopy({ ...dataCopy, data: generateObject(t || e.detail.value), typeData: { ...dataCopy.typeData, type: e.detail.value }})
            }}
          >
            <IonSelectOption value='string'>
              string
            </IonSelectOption>
            <IonSelectOption value='number'>
              number
            </IonSelectOption>
            <IonSelectOption value='boolean'>
              boolean
            </IonSelectOption>
            <IonSelectOption value='enum'>
              enum
            </IonSelectOption>

            {
              system?.types.map((type) => {
                return (
                  <IonSelectOption key={type.name} value={type.name}>
                    {type.name}
                  </IonSelectOption>
                )
              })
            }
          </IonSelect>
        </IonItem>

        {
          (type) && (
            <IonItem color='light'>
              <IonCheckbox labelPlacement='start' checked={dataCopy.typeData.isArray} onIonChange={() => {
                if (!dataCopy.typeData.isArray) {
                  setDataCopy({ ...dataCopy, data: [], typeData: { ...dataCopy.typeData, isArray: true }})
                } else {
                  setDataCopy({ ...dataCopy, data: '', typeData: { ...dataCopy.typeData, isArray: false }})
                }
              }}>Is Array?</IonCheckbox>
            </IonItem>
          )
        }

        <div style={{ height: 15 }} />

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

        <div style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
          <IonButton
            color='danger'
            onClick={() => {
              if (onDelete) onDelete()
              requestClose()
            }}
          >
            {(onDelete) ? 'Delete' : 'Close'}
          </IonButton>

          <IonButton
            color='success'
            onClick={() => {
              onSave(dataCopy)
              requestClose()
            }}
          >
            Save
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

function getComponentFromType(type: SystemType, data: any, dataCopy: any, typeData: TypeData, label: string, setProperty: (path: string, obj: any, value: any) => void): React.ReactElement {
  switch (type.name) {
    case 'string':
      return (
        <IonItem color='light'>
          <IonInput label={label} value={data} onIonInput={(ev) => setProperty('data', dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'number':
      return (
        <IonItem color='light'>
          <IonInput type='number' label={label}  value={data} onIonInput={(ev) => setProperty('data', dataCopy, +(ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'textarea':
      return (
        <IonItem color='light'>
          <IonTextarea label-placement='floating' rows={4} label={label}  value={data} onIonInput={(ev) => setProperty('data', dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'boolean':
      return (
        <IonItem color='light'>
          <IonCheckbox labelPlacement='start' checked={data} onIonChange={() => setProperty('data', dataCopy, !data)}>{label} </IonCheckbox>
        </IonItem>
      )
    case 'enum':
      return (
        <IonSelect label={label} labelPlacement='floating' color='light' fill='solid' interface='popover'
          value={data}
          onIonChange={(e) => setProperty('data', dataCopy, e.detail.value)}
        >
          {
            typeData.options.map((option: string) => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)
          }
        </IonSelect>
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

        <IonButton
          onClick={() => onAdd(generateObject(type))}
        >
          Add
        </IonButton>
      </div>

      <p style={{ height: 1, width: '100%', backgroundColor: 'white', marginTop: 4, marginBottom: 4 }} />

      <IonList inset={true}>
        {data.map((item, i) => {
          return (
            <IonItem color='light' key={item.name} button={true} onClick={() => setEditData(item)}>
              <IonLabel>{item.name}</IonLabel>
            </IonItem>
          )
        })}
      </IonList>
    </div>
  )
}

export default EditSystemData