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
  IonLabel,
  IonCheckbox,
  IonNote,
} from '@ionic/react'

import { BlueprintData, TypeData } from '../state/systems'
import { openModal } from '../state/modals'
import { systemState } from '../state/system'

type Props = {
  data: string | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: string): void;
  onDelete?(): void;
}

function EditStringModal(props: Props) {
  const { data, requestClose, onSave, onDelete } = props

  const [string, setString] = useState('')

  useEffect(() => {
    if (!data) return
  
    setString(data)
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
              if (!string) return requestClose()
              if (!data) return requestClose()
              
              onSave(string)
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
            label='Name'
            labelPlacement='stacked'
            type='text'
            placeholder='baba yaga'
            value={string}
            onIonInput={(ev) => setString((ev.target as unknown as HTMLInputElement).value)}
          />
        </IonItem>
      </IonContent>
    </IonModal>
  )
}

export default EditStringModal