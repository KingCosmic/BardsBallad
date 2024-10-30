import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonSearchbar, IonText } from '@ionic/react'
import { add } from 'ionicons/icons'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import { useState } from 'react'
import EditObjectModal from '../modals/EditObjectModal'
import generateObject from '../utils/generateObject'
import findAllOfProperty from '../utils/findAllOfProperty'
import { openModal } from '../state/modals'

type TabProps = {
  character: CharacterData
}

function Feats({ character }: TabProps) {
  
  const allFeats = findAllOfProperty(character.data, 'features', 'data')
  
  return (
    <>
      <IonList inset={true}>
        {
          allFeats.map(({ path, val: feat }) => {
            return (
              <IonItem button={true} onClick={() => {
                openModal({ title: 'Edit Info', objData: feat,
                  onDelete: () => runJsonAction({
                    name: 'Remove Feat',
                    target: path,
                    type: JsonActionType.REMOVEITEM,
                    value: feat.name
                  }),
                  onSave: (data) => runJsonAction({
                    name: 'Update Feat',
                    target: `${path}/${feat.name}`,
                    type: JsonActionType.OVERRIDE,
                    value: data
                  })
                })
              }}>
                <IonLabel>
                  <IonText>{feat.name}</IonText>
                  <br />
                  <IonNote color='medium' className='ion-text-wrap'>
                    {feat.description}
                  </IonNote>
                </IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>

      <IonFab slot='fixed' vertical='bottom' horizontal='end'>
        <IonFabButton onClick={() => {
          runJsonAction({
            name: 'Add Feat', target: 'data/features', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Feature')!)
          })}
        }>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Feats