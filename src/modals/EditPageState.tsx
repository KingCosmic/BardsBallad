import { useEffect, useState } from 'react'

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
  IonCheckbox,
} from '@ionic/react'

import { systemState, updatePageState } from '../state/system'
import { TypeData } from '../state/systems';
import { editorState } from '../state/editor';

type Props = {
  data: { name: string, type: TypeData } | null;

  isOpen: boolean;
  requestClose(): void;
}

function EditPageStateModal(props: Props) {
  const { data, requestClose } = props

  const system = systemState.useValue()
  const editor = editorState.useValue()

  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [isArray, setIsArray] = useState(false)

  if (!system) return


  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setType(data.type.type)
    setIsArray(data.type.isArray || false)
  }, [data])

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={() => requestClose()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Add Page State</IonTitle>
          <IonButtons slot='end'>
            <IonButton color='primary' strong={true} onClick={() => {
              if (!name) return requestClose()
              if (!type) return requestClose()
              if (!props.data) return requestClose()

              const newStateData: { name: string, type: TypeData } = {
                name,
                type: {
                  type,
                  isArray,
                  useTextArea: false,
                  options: []
                }
              }

              updatePageState(editor.page, props.data.name, newStateData)
              
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
            label='Variable Name'
            labelPlacement='stacked'
            type='text'
            placeholder='filteredEquipment'
            value={name}
            onIonInput={(ev) => setName((ev.target as unknown as HTMLInputElement).value)}
          />
        </IonItem>

        <IonItem>
          <IonSelect label='System' labelPlacement='stacked'
            value={type}
            onIonChange={(e) => setType(e.detail.value)}
          >
            {
              system.types.map((type) => <IonSelectOption key={type.name} value={type.name}>{type.name}</IonSelectOption>)
            }
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonCheckbox value={isArray} onIonChange={() => setIsArray(!isArray)}>is Array?</IonCheckbox>
        </IonItem>
      </IonContent>
    </IonModal>
  )
}

export default EditPageStateModal