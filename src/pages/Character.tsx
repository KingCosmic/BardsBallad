import { IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/react'
import './Page.css'
import { characterState, setCurrentCharacter } from '../state/character'
import { useEffect, useState } from 'react'

import { useParams } from 'react-router'
import { charactersState } from '../state/characters'

import { informationCircleOutline } from 'ionicons/icons'
import { PageData } from '../state/systems'
import RenderEditorData from '../designer/RenderEditorData'

const Character: React.FC = () => {
  const characters = charactersState.useValue()
  const character = characterState.useValue()

  const [tab, setTab] = useState(character ? character.system.pages[0].name : 'test')

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    const character = characters.find(c => c.name === name)
    setCurrentCharacter(character)

    if (!character) return

    setTab(character.system.pages[0].name)
  }, [characters, name, setTab, setCurrentCharacter])

  if (!character) return <>loading...</>

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton menu='nav-menu' />
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
        <IonSelect className='ion-margin-bottom' label='Tab'
          interface='popover'
          fill='outline'
          value={tab}
          onIonChange={(e) => setTab(e.detail.value)}
        >
          {
            character.system.pages.map((page) => <IonSelectOption key={page.name} value={page.name}>{page.name}</IonSelectOption>)
          }
        </IonSelect>

        {
          character.system.pages.map((page) => <RenderTab key={page.name} page={page} hidden={page.name !== tab} />)
        }
      </IonContent>
    </IonPage>
  )
}

function RenderTab({ page, hidden }: { page: PageData, hidden: boolean }) {
  return (
    <RenderEditorData style={{ display: hidden ? 'none': 'block' }} data={JSON.parse(page.lexical)} />
  )
}

export default Character;
