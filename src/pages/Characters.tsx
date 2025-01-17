import { IonActionSheet, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonMenuButton, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { charactersState, deleteCharacter } from '../state/characters'
import { setCharacter, type CharacterData } from '../state/character'
import { add } from 'ionicons/icons'
import CharacterCreatorModal from '../modals/CharacterCreator'

import { Link } from 'react-router-dom'
import Pressable from '../components/Pressable'
import { useEffect, useState } from 'react'

const Characters: React.FC = () => {
  const characters = charactersState.useValue()

  const [isDeleting, setIsDeleting] = useState<null | CharacterData>(null)

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Characters</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className='ion-padding' fullscreen>
        <IonSearchbar />

        {characters.length ? (
          characters.map((char) => (
            <Pressable key={char.name} onLongPress={() => setIsDeleting(char)}>
              <IonCard routerLink={`/character/${char.name}`}>
                <IonCardHeader>
                  <IonCardTitle>{char.name}</IonCardTitle>
                  <IonCardSubtitle>{char.system.name}</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            </Pressable>
          ))
        ) : (
          <IonText>
            <h5>
              Doesn't look like you have any characters yet? Try creating one!
            </h5>
          </IonText>
        )}

        <IonFab slot='fixed' vertical='bottom' horizontal='end'>
          <IonFabButton id='open-creator'>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <CharacterCreatorModal />
        
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
              deleteCharacter(isDeleting?.name || '')
            }

            setIsDeleting(null)
          }}
        />
      </IonContent>
    </IonPage>
  );
}

export default Characters;
