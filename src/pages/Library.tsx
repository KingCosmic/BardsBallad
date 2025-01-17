import { IonActionSheet, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonNote, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'

import { createSystem, deleteSystem, SystemData, systemsState } from '../state/systems'

import { add } from 'ionicons/icons'
import Pressable from '../components/Pressable'
import { useState } from 'react'

const Library: React.FC = () => {
  const systems = systemsState.useValue()

  const [isDeleting, setIsDeleting] = useState<null | SystemData>(null)

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
            <Pressable key={sys.name} onLongPress={() => setIsDeleting(sys)}>
              <IonCard routerLink={`/systems/${sys.name}`}>
                <IonCardHeader>
                  <IonCardTitle>{sys.name}</IonCardTitle>
                  <IonCardSubtitle>v{sys.version}</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </Pressable>
          ))
        ) : (
          <IonText>Doesn't look like you have any systems refreshing should load a backup of dnd5e</IonText>
        )}

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton onClick={() => createSystem()}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={isDeleting !== null}
          header={`Delete ${isDeleting?.name}`}
          buttons={[
            {
              text: 'Delete',
              role: 'destructive',
              data: {
                action: 'delete',
              },
            },
            {
              text: 'Cancel',
              role: 'cancel',
              data: {
                action: 'cancel',
              },
            },
          ]}
          onDidDismiss={({ detail }) => {
            if (detail.data.action === 'delete') {
              deleteSystem(isDeleting?.name || '')
            }

            setIsDeleting(null)
          }}
        />
      </IonContent>
    </IonPage>
  );
}

export default Library;
