import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonSearchbar } from '@ionic/react'
import { add } from 'ionicons/icons'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import { useState } from 'react'
import EditObjectModal from '../modals/EditObjectModal'
import generateObject from '../utils/generateObject'

type TabProps = {
  character: CharacterData
}

function Equipment({ character }: TabProps) {

  const [filter, setFilter] = useState('')
  const [equipmentData, setEquipmentData] = useState<any>(null)

  return (
    <>
      <EditObjectModal title='Edit Equipment'
        onDelete={() => runJsonAction({
          name: 'Update Equipment',
          target: 'data/equipment',
          type: JsonActionType.REMOVEITEM,
          value: equipmentData.name
        })}
        onSave={(item) => runJsonAction({
          name: 'Update Equipment',
          target: `data/equipment/${equipmentData.name}`,
          type: JsonActionType.OVERRIDE,
          value: item
        })}
        isVisible={(equipmentData !== null)} requestClose={() => setEquipmentData(null)} data={equipmentData}
      />

      <IonSearchbar animated={true} placeholder='Search Equipment...' onIonInput={(ev) => setFilter((ev.target as unknown as HTMLInputElement).value)} />

      <IonList inset={true}>
        {
          character.data.equipment.map((item: any) => {
            return (
              <IonItem button={true} onClick={() => setEquipmentData(item)}>
                <IonIcon color='warning' slot='start' size='small' />
                <IonLabel>{item.name}</IonLabel>
                <IonNote slot='end'>{item.quantity}</IonNote>
              </IonItem>
            )
          })
        }
      </IonList>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton onClick={() =>
          runJsonAction({
            name: 'Add Equipment', target: 'data/equipment', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Equipment')!)
          })}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Equipment