import { IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'

import { createSystem, systemsState } from '../state/systems'

import { add } from 'ionicons/icons'

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
            Click on a system to edit it!
          </h6>
        </IonNote>

        {systems.length ? (
          systems.map((sys) => (
            <IonCard key={sys.name} routerLink={`/systems/${sys.name}`}>
              <IonCardHeader>
                <IonCardTitle>{sys.name}</IonCardTitle>
                <IonCardSubtitle>v{sys.version}</IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          ))
        ) : (
          <IonText>Doesn't look like you have any systems yet... I'm not sure how this happened haha, please report it in the discord or other channels</IonText>
        )}

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => createSystem()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default Library;
