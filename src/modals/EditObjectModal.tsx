import React, { useState } from 'react';
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

import { characterState } from '../state/character';
import getDefFromProperty from '../utils/getDefFromProperty';
import setNestedProperty from '../utils/setNestedProperty';
import generateObject from '../utils/generateObject';

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: { [key:string]: any }): void;
  
  isVisible: boolean;
  requestClose(): void;
  data: { [key:string]: any };
}

function EditObjectModal({ title, onDelete, onSave, isVisible, requestClose, data }: ModalProps) {
  if (!data) return <></>

  const [dataCopy, setDataCopy] = useState<{ [key:string]: any }>(data)

  const character = characterState.useValue()

  // TODO:
  // Build out inputs for object values. (not sure on other custom types. but modifiers will always be on the "modifiers" property.)

  const setProperty = (key:string, obj:{ [key:string]: any }, value:any) => {
    setDataCopy(produce(obj, draft => {
      setNestedProperty(draft, key, value)
    
      return draft
    }))
  }

  const keys = Object.keys(dataCopy._def || {})

  return (
    <IonModal isOpen={isVisible}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={requestClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        {
          keys.map((key) => {
            if (key.startsWith('_')) return <></>

              const data = dataCopy[key]

              const def = dataCopy._def[key]

              let type = (typeof def === 'string') ? def : def.type
              let options = (typeof def === 'string') ? { type } : def

              // TODO: convert 

              if (type === 'BasedOffTargetAndType') {
                // TODO: arguably we can just check type.. cause we have addItem and removeItem specifically for arrays. Override would have to be checked for type since it goes to multiple.

                const propertyDef = getDefFromProperty(character!, dataCopy.target)

                if (propertyDef) {
                  type = propertyDef.type
                  options = propertyDef
                }
              }

              if (options.isArray) type = 'array'

              switch (type) {
                case 'string':
                  return (
                    <IonItem key={key}>
                      <IonInput label={key} value={data} onIonInput={(ev) => setProperty(key, dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
                    </IonItem>
                  )
                case 'number':
                  return (
                    <IonItem key={key}>
                      <IonInput type='number' label={key} value={data} onIonInput={(ev) => setProperty(key, dataCopy, +(ev.target as unknown as HTMLInputElement).value)} />
                    </IonItem>
                  )
                case 'textarea':
                  return (
                    <IonItem key={key}>
                      <IonTextarea label-placement='floating' rows={4} label={key} value={data} onIonInput={(ev) => setProperty(key, dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
                    </IonItem>
                  )
                case 'boolean':
                  return (
                    <IonItem key={key}>
                      <IonCheckbox labelPlacement='start' checked={data} onIonChange={() => setProperty(key, dataCopy, !data)}>{key}</IonCheckbox>
                    </IonItem>
                  )
                case 'enum':
                  return (
                    <IonSelect label={key} labelPlacement='floating'
                      value={data}
                      onIonChange={(e) => setProperty(key, dataCopy, e.detail.value)}
                    >
                      {
                        def.options.map((option: string) => <IonSelectOption value={option}>{option}</IonSelectOption>)
                      }
                    </IonSelect>
                  )
                case 'array':
                  return (
                    <ArrayEdit
                      key={key}
                      {...options}
                      type={character?.system.types.find(type => type.name === options.type)}
                      title={key}
                      data={data}
                      onAdd={(newItem) => setProperty(key, dataCopy, [...data, newItem])}
                      onChange={(path, newItems) => setProperty(path, dataCopy, newItems)}
                      onDelete={(name) => setProperty(key, dataCopy, data.filter((item: any) => item.name !== name))}
                    />
                  )

                  // if it's not an array then... just recursive shit.
                  // TODO:
                default:
                  return (
                    <IonItem key={key}>{type} is not a supported type.</IonItem>
                  )
              }
          })
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

function ArrayEdit({ title, data, type, onAdd, onChange, onDelete }: { title: string; data: any[]; type: { [key:string]: any }; onAdd(data:object): void; onChange(path: string, value: any): void; onDelete(itemName:string): void; }) {
  const [editData, setEditData] = useState<any>(null)

  return (
    <div>
      <EditObjectModal
        title={`Edit ${title}`}
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
            <IonItem key={item.name} button={true} onClick={() => setEditData(item)}>
              <IonLabel>{item.name}</IonLabel>
            </IonItem>
          )
        })}
      </IonList>
    </div>
  )
}

export default EditObjectModal;