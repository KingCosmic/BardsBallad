import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonSearchbar, IonText } from '@ionic/react'
import { add } from 'ionicons/icons'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import { useState } from 'react'
import EditObjectModal from '../modals/EditObjectModal'
import generateObject from '../utils/generateObject'

type TabProps = {
  character: CharacterData
}

function Notes({ character }: TabProps) {
  const [editData, setEditData] = useState<any>(null)
  
  return (
    <>
      <EditObjectModal title='Edit Note'
        onDelete={() => runJsonAction({
          name: 'Delete Note',
          target: 'data/notes',
          type: JsonActionType.REMOVEITEM,
          value: editData.name
        })}
        onSave={(item) => runJsonAction({
          name: 'Update Note',
          target: `data/notes/${editData.name}`,
          type: JsonActionType.OVERRIDE,
          value: item
        })}
        isVisible={(editData !== null)} requestClose={() => setEditData(null)} data={editData}
      />

      <IonList inset={true}>
        {
          character.data.notes.map((item: any) => {
            return (
              <IonItem button={true} onClick={() => setEditData(item)}>
                <IonLabel>
                  <IonText>{item.name}</IonText>
                  <br />
                  <IonNote color='medium' className='ion-text-wrap'>
                    {item.description}
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
            name: 'Add Note', target: 'data/notes', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Note')!)
          })}
        }>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Notes