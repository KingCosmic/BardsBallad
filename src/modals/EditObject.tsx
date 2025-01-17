import { useEffect, useState } from 'react';

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

import setNestedProperty from '../utils/setNestedProperty'
import generateObject from '../utils/generateObject'
import { SystemType, TypeData } from '../state/systems'
import Divider from '../components/Divider';

type ModalProps = {
  title: string;
  onDelete?(): void;
  onSave(newData: any): void;
  
  isVisible: boolean;
  requestClose(): void;
  data: any;
  types: SystemType[];

  type?: string;
  typeData?: TypeData;
}

function EditObject({ title, onDelete, onSave, isVisible, requestClose, data, types, type, typeData }: ModalProps) {
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
          (type && typeData) ? RenderComponentFromType(types, type, dataCopy, dataCopy, typeData, '', setProperty)
          : GetComponentsFromTypeData(dataCopy, types, setProperty)
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


export function GetComponentsFromTypeData(dataCopy: any, types: SystemType[], setProperty: (key:string, obj:{ [key:string]: any }, value:any) => void) {
  return (
    <div>
      {
        (dataCopy._type as SystemType).properties.map((prop) => {
          const key = prop.key
          const data = dataCopy[key]

          const def = prop.typeData

          let type = def.type

          // if (type === 'BasedOffTargetAndType') {
          //   // TODO: arguably we can just check type.. cause we have addItem and removeItem specifically for arrays. Override would have to be checked for type since it goes to multiple.

          //   const propertyDef = getDefFromProperty(character!, dataCopy.target)

          //   if (propertyDef) {
          //     type = propertyDef.type
          //     options = propertyDef
          //   }
          // }

          return (
            <>
              {
                RenderComponentFromType(types, type, data, dataCopy, prop.typeData, key, setProperty)
              }
            </>
          )
        })
      }
    </div>
  )
}


export function RenderComponentFromType(types: SystemType[], type: string, data: any, dataCopy: any, typeData: TypeData, label: string, setProperty: (path: string, obj: any, value: any) => void): React.ReactElement {
  
  if (type && typeData.isArray) {
    return (
      <ArrayEdit
        types={types}
        type={types.find(typeData => typeData.name === type)!}
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
      return (
        <IonItem color='light' key={label}>
          <IonInput label={label} value={data} onIonInput={(ev) => setProperty(label, dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'number':
      return (
        <IonItem color='light' key={label}>
          <IonInput type='number' label={label}  value={data} onIonInput={(ev) => setProperty(label, dataCopy, +(ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'textarea':
      return (
        <IonItem color='light' key={label}>
          <IonTextarea label-placement='floating' rows={4} label={label}  value={data} onIonInput={(ev) => setProperty(label, dataCopy, (ev.target as unknown as HTMLInputElement).value)} />
        </IonItem>
      )
    case 'boolean':
      return (
        <IonItem color='light' key={label}>
          <IonCheckbox labelPlacement='start' checked={data} onIonChange={() => setProperty(label, dataCopy, !data)}>{label}</IonCheckbox>
        </IonItem>
      )
    case 'enum':
      return (
        <IonSelect labelPlacement='floating' color='light' key={label}
          value={data}
          onIonChange={(e) => setProperty(label, dataCopy, e.detail.value)}
        >
          {
            typeData.options.map((option: string) => <IonSelectOption key={option} value={option}>{option}</IonSelectOption>)
          }
        </IonSelect>
      )

    default:
      return (
        <IonItem color='light' key={label} button>
          <IonLabel>{label} ({type})</IonLabel>
        </IonItem>
      )
  }
}

function ArrayEdit({ title, data, type, types, onAdd, onChange, onDelete }: { title: string; data: any[]; type: SystemType; types: SystemType[]; onAdd(data: any): void; onChange(path: string, value: any): void; onDelete(itemName:string): void; }) {
  const [editData, setEditData] = useState<any>(null)

  return (
    <div key={editData?.name}>
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

        <IonButton
          onClick={() => onAdd(generateObject(type))}
        >
          Add
        </IonButton>
      </div>

      <Divider />

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

export default EditObject