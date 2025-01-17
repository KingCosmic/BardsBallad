import { useEffect, useMemo, useState } from 'react'

import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonCheckbox,
  IonList,
} from '@ionic/react'

import { TypeData } from '../state/systems'
import { systemState } from '../state/system'
import EditStringModal from './EditString'

type Props = {
  data: { key: string; typeData: TypeData, typeName: string } | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: { key: string; typeData: TypeData }): void;
  onDelete(): void;
}

function EditTypeModal(props: Props) {
  const { data, requestClose, onSave, onDelete } = props

  const [key, setKey] = useState('')
  const [propertyData, setPropertyData] = useState<TypeData>({ type: '', useTextArea: false, isArray: false, options: [] })

  const [editOption, setEditOption] = useState<string | null>(null)

  const system = systemState.useValue()

  const parentType = useMemo(() => system?.types.find(t => t.name === data?.typeName), [data, system])

  useEffect(() => {
    if (!data) return
  
    setKey(data.key)
    setPropertyData({ ...{ useTextArea: false, isArray: false }, ...data.typeData })
  }, [data])

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={() => requestClose()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Edit Type Property</IonTitle>
          <IonButtons slot='end'>
            <IonButton color='primary' strong={true} onClick={() => {
              if (!key) return requestClose()
              if (!propertyData) return requestClose()
              if (!props.data) return requestClose()

              const newTypeData = {
                key,
                typeData: propertyData
              }
              
              onSave(newTypeData)
              requestClose()
            }}>
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonItem>
          <IonInput
            label='Key'
            labelPlacement='stacked'
            type='text'
            placeholder='baba yaga'
            value={key}
            onIonInput={(ev) => setKey((ev.target as unknown as HTMLInputElement).value)}
          />
        </IonItem>

        <IonItem>
          <IonSelect label='Type' labelPlacement='stacked'
            value={propertyData.type}
            onIonChange={(e) => setPropertyData({ ...propertyData, type: e.detail.value })}
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

        <IonItem>
          <IonCheckbox checked={propertyData.isArray} onIonChange={() => setPropertyData({ ...propertyData, isArray: !propertyData.isArray })}>Is Array?</IonCheckbox>
        </IonItem>

        {
          ((propertyData.type === 'string') && (!propertyData.isArray)) && (
            <IonItem>
              <IonCheckbox checked={propertyData.useTextArea} onIonChange={() => setPropertyData({ ...propertyData, useTextArea: !propertyData.useTextArea })}>Use Textarea?</IonCheckbox>
            </IonItem>
          )
        }

        {
          (propertyData.type === 'enum') && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>Options</p>

                <IonButton
                  onClick={() => {
                    const index = propertyData.options.findIndex(o => o === 'New Option')

                    if (index !== -1) return

                    setPropertyData({ ...propertyData, options: [ ...propertyData.options, 'New Option'] })
                  }}
                >
                  Add
                </IonButton>
              </div>

              <p style={{ height: 1, width: '100%', backgroundColor: 'white', marginTop: 4, marginBottom: 4 }} />

              <IonList inset={true}>
                {propertyData.options.map((item) => {
                  return (
                    <IonItem color='light' key={item} button={true} onClick={() => setEditOption(item)}>
                      <IonLabel>{item}</IonLabel>
                    </IonItem>
                  )
                })}
              </IonList>
            </div>
          )
        }

        <div style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
          <IonButton
            color='danger'
            onClick={() => {
              onDelete()
              requestClose()
            }}
            disabled={parentType?.properties.length === 1}
          >
            Delete
          </IonButton>
        </div>

        <EditStringModal data={editOption} isOpen={editOption !== null}
          requestClose={() => setEditOption(null)}
          onSave={(data) => {
            let newOptions = [ ...propertyData.options ]

            const index = newOptions.findIndex(o => o === editOption)

            if (index === -1) return

            newOptions[index] = data

            setPropertyData({ ...propertyData, options: newOptions })
          }}
        />
      </IonContent>
    </IonModal>
  )
}

export default EditTypeModal