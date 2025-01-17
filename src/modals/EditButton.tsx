import { useEffect, useRef, useState } from 'react'

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
} from '@ionic/react'

import { systemState, updatePageState } from '../state/system'
import { BlueprintData, TypeData } from '../state/systems';
import { editorState } from '../state/editor';
import { openModal } from '../state/modals';

type Props = {
  data: { name: string; icon: string; blueprint: BlueprintData } | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: any): void;
  onDelete(): void;
}

function EditButtonModal(props: Props) {
  const { data, requestClose, onSave, onDelete } = props

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [blueprint, setBlueprint] = useState<BlueprintData>({ nodes: [], edges: [] })


  useEffect(() => {
    if (!data) return
  
    setName(data.name)
    setIcon(data.icon)
    setBlueprint(data.blueprint)
  }, [data])

  return (
    <IonModal isOpen={props.isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={() => requestClose()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Edit Button State</IonTitle>
          <IonButtons slot='end'>
            <IonButton color='primary' strong={true} onClick={() => {
              const newButtonData = {
                name,
                icon,
                blueprint
              }
              
              onSave(newButtonData)
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
            label='Button Name'
            labelPlacement='stacked'
            type='text'
            placeholder='baba yaga'
            value={name}
            onIonInput={(ev) => setName((ev.target as unknown as HTMLInputElement).value)}
          />
        </IonItem>

        <IonItem>
          <IonSelect label='Icon' labelPlacement='stacked'
            value={icon}
            onIonChange={(e) => setIcon(e.detail.value)}
          >
            <IonSelectOption value='test'>
              test
            </IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem button={true} onClick={() => openModal({
            type: 'blueprint',
            title: '',
            data: blueprint,
            onSave: (bp) => setBlueprint(bp)
          })}>
          <IonLabel>On Click Action</IonLabel>
        </IonItem>

        <div style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
          <IonButton
            color='danger'
            onClick={() => {
              onDelete()
              requestClose()
            }}
          >
            Delete
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  )
}

export default EditButtonModal