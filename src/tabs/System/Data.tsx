import { IonAccordion, IonAccordionGroup, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonNote, IonSearchbar, IonText } from '@ionic/react'
import { add } from 'ionicons/icons'
import { addSystemData, deleteSystemData, systemState, updateSystemData } from '../../state/system'
import { useState } from 'react'
import { DataType } from '../../state/systems'
import EditSystemData from '../../modals/EditSystemData'
import EditObject from '../../modals/EditObject'

function Data() {
  const system = systemState.useValue()

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      <EditSystemData
        types={system?.types || []}
        onDelete={() => deleteSystemData(editData!.name)}
        onSave={(newData) => updateSystemData(editData!.name, newData)}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />
      
      <IonSearchbar color='light' />

      <IonAccordionGroup>
        {
          system?.data.map((data) => {
            return (
              <IonItem key={data.name} color='light' onClick={() => setEditData(data)} button>
                <IonLabel>{data.name}</IonLabel>
              </IonItem>
            )
          })
        }
      </IonAccordionGroup>

      <IonFab slot='fixed' vertical='bottom' horizontal='end'>
        <IonFabButton onClick={addSystemData}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Data