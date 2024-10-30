import { IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'

import { systemsState } from '../state/systems'

import { Link } from 'react-router-dom'

const Library: React.FC = () => {
  const systems = systemsState.useValue()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Library</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding' fullscreen>
        <IonSearchbar />

        <IonNote>
          <h6 style={{ paddingLeft: 12, paddingRight: 12 }}>
            In the future you can edit / create new systems for use. These will involve some custom tooling that's currently in development.
          </h6>
        </IonNote>

        {systems.length ? (
          systems.map((sys) => (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{sys.name}</IonCardTitle>
                <IonCardSubtitle>v{sys.version}</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          ))
        ) : (
          <IonText>Doesn't look like you have any systems yet... I'm not sure how this happened haha, please report it in the discord or other channels</IonText>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Library;
