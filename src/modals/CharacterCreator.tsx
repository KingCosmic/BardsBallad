import React, { useRef, useState } from 'react'

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
} from '@ionic/react'
import { createCharacter } from '../state/characters'
import { systemsState } from '../state/systems'

function CharacterCreatorModal(props:any) {
  const modal = useRef<HTMLIonModalElement>(null)

  const systems = systemsState.useValue()

  const [name, setName] = useState('')
  const [system, setSystem] = useState((systems[0]) ? systems[0] : null)

  return (
    <IonModal ref={modal} {...props} trigger='open-creator'>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Create Chararacter</IonTitle>
          <IonButtons slot='end'>
            <IonButton color='primary' strong={true} onClick={() => {
              if (!system) return modal.current?.dismiss()
              if (!name) return
              createCharacter(name, system)
              setName('')
              setSystem((systems[0]) ? systems[0] : null)
              modal.current?.dismiss()
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
            placeholder='Aliza Cartwight'
            value={name}
            onIonInput={(ev) => setName((ev.target as unknown as HTMLInputElement).value)}
          />
        </IonItem>

        <IonItem>
          <IonSelect label='System' labelPlacement='stacked' interface='popover'
            value={system}
            onIonChange={(e) => setSystem(e.detail.value)}
          >
            {
              systems.map((option) => <IonSelectOption key={option.name} value={option}>{option.name}</IonSelectOption>)
            }
          </IonSelect>
        </IonItem>
      </IonContent>
    </IonModal>
  )
}

export default CharacterCreatorModal;