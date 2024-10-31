import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenu, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar } from '@ionic/react'
import './Page.css'
import { characterState, setCharacter } from '../state/character'
import { useEffect, useState } from 'react'
import Equipment from '../tabs/Equipment'
import Info from '../tabs/Info'
import Skills from '../tabs/Skills'

import { useParams } from 'react-router'
import { charactersState } from '../state/characters'

import { isPlatform } from '@ionic/react'

import { informationCircleOutline } from 'ionicons/icons'
import Combat from '../tabs/Combat'
import ModalManager from '../components/ModalManager'
import Feats from '../tabs/Feats'
import Notes from '../tabs/Notes'
import Spells from '../tabs/Spells'
import Divider from '../components/Divider'

const Character: React.FC = () => {
  const characters = charactersState.useValue()
  const character = characterState.useValue()

  const [tab, setTab] = useState('Info')

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    setCharacter(characters.find(c => c.name === name))
  }, [name])

  if (!character) return <>loading...</>

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
            {/* <IonMenuButton menu='nav-menu' /> */}
          </IonButtons>
          <IonTitle>{character.name}</IonTitle>
          <IonButtons slot='end'>
            <IonMenuButton menu='info-menu'>
              <IonIcon icon={informationCircleOutline} />
            </IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding' fullscreen>

      {
        isPlatform('desktop') ? (
          <div>
            <IonButtons>
              <IonButton
                color={(tab === 'Info') ? 'warning' : ''}
                onClick={() => setTab('Info')}
              >
                Info
              </IonButton>

              <IonButton
                color={(tab === 'Skills') ? 'warning' : ''}
                onClick={() => setTab('Skills')}
              >
                Skills
              </IonButton>

              <IonButton
                color={(tab === 'Spells') ? 'warning' : ''}
                onClick={() => setTab('Spells')}
              >
                Spells
              </IonButton>

              <IonButton
                color={(tab === 'Equipment') ? 'warning' : ''}
                onClick={() => setTab('Equipment')}
              >
                Equipment
              </IonButton>

              <IonButton
                color={(tab === 'Combat') ? 'warning' : ''}
                onClick={() => setTab('Combat')}
              >
                Combat
              </IonButton>

              <IonButton
                color={(tab === 'Features') ? 'warning' : ''}
                onClick={() => setTab('Features')}
              >
                Features
              </IonButton>

              <IonButton
                color={(tab === 'Notes') ? 'warning' : ''}
                onClick={() => setTab('Notes')}
              >
                Notes
              </IonButton>
            </IonButtons>
            <Divider />
          </div>
        ) : (
          <IonSelect className='ion-margin-bottom' label='Tab'
            fill='outline'
            value={tab}
            onIonChange={(e) => setTab(e.detail.value)}
          >
            <IonSelectOption value='Info'>Info</IonSelectOption>
            <IonSelectOption value='Skills'>Skills</IonSelectOption>
            <IonSelectOption value='Spells'>Spells</IonSelectOption>
            <IonSelectOption value='Equipment'>Equipment</IonSelectOption>
            <IonSelectOption value='Combat'>Combat</IonSelectOption>
            <IonSelectOption value='Features'>Features</IonSelectOption>
            <IonSelectOption value='Notes'>Notes</IonSelectOption>
          </IonSelect>
        )
      }

        {getTab(tab, { character })}

        <ModalManager />
      </IonContent>
    </IonPage>
  )
}

function getTab(tab: string, props: any) {
  switch(tab) {
    case 'Info':
      return <Info {...props} />
    case 'Skills':
      return <Skills {...props} />
    case 'Equipment':
      return <Equipment {...props} />
    case 'Spells':
      return <Spells {...props} />
    case 'Combat':
      return <Combat {...props} />
    case 'Features':
      return <Feats {...props} />
    case 'Notes':
      return <Notes {...props} />
    default:
      return <p>{tab} is not a valid tab.</p>
  }
}

export default Character;
