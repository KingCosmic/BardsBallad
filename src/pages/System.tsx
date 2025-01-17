import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import './Page.css'
import { useEffect } from 'react'

import { useParams } from 'react-router'

import { informationCircleOutline } from 'ionicons/icons'

import { systemsState } from '../state/systems'
import { setSystem, systemState } from '../state/system'

import { editorState, setPage, setTab } from '../state/editor'
import Character from '../tabs/System/Character'
import Data from '../tabs/System/Data'
import Types from '../tabs/System/Types'
import Editor from '../tabs/System/Editor'
import Functions from '../tabs/System/Functions'

const System: React.FC = () => {
  const systems = systemsState.useValue()
  const system = systemState.useValue()

  const editor = editorState.useValue()

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    const system = systems.find(s => s.name === name)
    setSystem(system)

    if (!system) return

    setPage(system.pages[0].name)
  }, [name, systems])

  if (!system) return <>loading...</>

  return (
    <IonPage className='page-container'>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{system.name}</IonTitle>
          <IonButtons slot='end'>
            <IonMenuButton menu='info-menu'>
              <IonIcon icon={informationCircleOutline} />
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' fullscreen>

        <IonSelect color='light' interface='popover' fill='outline'
          value={editor.tab}
          onIonChange={(e) => setTab(e.detail.value)}
        >
          <IonSelectOption value='character'>Character</IonSelectOption>
          <IonSelectOption value='data'>Data</IonSelectOption>
          <IonSelectOption value='types'>Types</IonSelectOption>
          <IonSelectOption value='functions'>Functions</IonSelectOption>
          <IonSelectOption value='editor'>Editor</IonSelectOption>
        </IonSelect>

        {
          (editor.tab === 'character') ? (
            <Character />
          ) : (editor.tab === 'data') ? (
            <Data />
          ) : (editor.tab === 'types') ? (
            <Types />
          ) : (editor.tab === 'functions') ? (
            <Functions />
          ) : (editor.tab === 'editor') && (
            <Editor />
          )
        }

      </IonContent>
    </IonPage>
  )
}

export default System
