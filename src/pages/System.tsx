import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import './Page.css'
import { useEffect } from 'react'

import { useParams } from 'react-router'

import { codeSlashOutline, desktopOutline, informationCircleOutline, lockOpenOutline, phonePortraitOutline, returnUpBackOutline, returnUpForwardOutline, saveOutline, tabletLandscapeOutline } from 'ionicons/icons'

import { systemsState } from '../state/systems'
import { setSystem, systemState } from '../state/system'
import { Editor, Frame, Element } from '@craftjs/core'
import Text from '../designer/Text'
// import Button from '../designerComponents/Button'
import Container from '../designer/Container'

const System: React.FC = () => {
  const systems = systemsState.useValue()
  const system = systemState.useValue()

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    setSystem(systems.find(s => s.name === name))
  }, [name])

  if (!system) return <>loading...</>

  return (
    <IonPage>
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

        {/* <div style={{ display: 'flex', flexDirection: 'row', padding: 5, justifyContent: 'space-between' }}>
          <div style={{ backgroundColor: 'orange' }}>
            <IonIcon size='large' name='undo' icon={returnUpBackOutline} />
            <IonIcon size='large' name='redo' icon={returnUpForwardOutline} />
          </div>
          <div style={{ backgroundColor: 'orange', paddingLeft: 20, paddingRight: 20 }}>
            <IonIcon size='large' name='view mobile' icon={phonePortraitOutline} />
            <IonIcon size='large' name='view tablet' icon={tabletLandscapeOutline} />
            <IonIcon size='large' name='view desktop' icon={desktopOutline} />
          </div>
          <div style={{ backgroundColor: 'orange' }}>
            <IonIcon size='large' name='lock' icon={lockOpenOutline} />
            <IonIcon size='large' name='save' icon={saveOutline} />
            <IonIcon size='large' name='code' icon={codeSlashOutline} />
          </div>
        </div> */}

        <Frame>
          <Element is={Container} padding='5px' background='#eee' canvas>
            <Text text='Hello World' fontSize={32} />

            {/* <Button text='Button!' size='small' color='primary' /> */}

            <Element is={Container} padding='5px' background='#999' canvas> // Canvas Node of type Container, droppable and draggable
              <Text fontSize={24} text='Its me again!' /> // Node of type Text, draggable
            </Element>
          </Element>
        </Frame>

      </IonContent>
    </IonPage>
  )
}

export default System
