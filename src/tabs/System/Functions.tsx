import { IonAccordion, IonAccordionGroup, IonButton, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonSearchbar } from '@ionic/react'
import { add } from 'ionicons/icons'
import { addType, addTypeProperty, deleteType, deleteTypeProperty, systemState, updateTypeName, updateTypeProperty } from '../../state/system'
import EditTypeModal from '../../modals/EditType'
import { SystemType, TypeData } from '../../state/systems'
import { useState } from 'react'
import EditStringModal from '../../modals/EditString'

function Types() {
  const system = systemState.useValue()

  const [editData, setEditData] = useState<{
    key: string;
    typeData: TypeData;
    typeName: string;
  } | null>(null)

  const [editName, setEditName] = useState<string | null>(null)

  return (
    <>
      <EditTypeModal data={editData} isOpen={editData !== null}
        requestClose={() => setEditData(null)}
        onSave={(data) => updateTypeProperty(editData?.typeName || '', editData?.key || '', data)}
        onDelete={() => deleteTypeProperty(editData?.typeName || '', editData?.key || '')}
      />

      <EditStringModal data={editName} isOpen={editName !== null}
        requestClose={() => setEditName(null)}
        onSave={(data) => updateTypeName(editName || '', data)}
      />
      
      <IonSearchbar color='light' />

      <IonAccordionGroup>
        {
          system?.types.map((type) => {
            return (
              <IonAccordion key={type.name} value={type.name}>
                <IonItem slot='header' color='light'>
                  <IonLabel>{type.name}</IonLabel>
                </IonItem>
                <div className='ion-padding' slot='content'>
                  <div>
                    <IonButton color='light' onClick={() => setEditName(type.name)}>Edit Name</IonButton>
                    <IonButton color='light' onClick={() => {
                      const propertyType = addTypeProperty(type.name)

                      if (!propertyType) return

                      setEditData({ ...propertyType, typeName: type.name })
                    }}>Add Property</IonButton>
                    <IonButton color='danger' onClick={() => deleteType(type.name)}>Delete Type</IonButton>
                  </div>
                  <IonList>
                    {
                      type.properties.map((t) => (
                        <IonItem key={t.key} button onClick={() => setEditData({ ...t, typeName: type.name })}>
                          <IonLabel>
                            {t.key} - {t.typeData.type} {t.typeData.isArray ? '(Array)' : ''} {t.typeData.options.join(',')}
                          </IonLabel>
                        </IonItem>
                      ))
                    }
                  </IonList>
                </div>
              </IonAccordion>
            )
          })
        }
      </IonAccordionGroup>

      <IonFab slot='fixed' vertical='bottom' horizontal='end'>
        <IonFabButton onClick={() => {
          addType()
          setEditName('New Blueprint')
        }}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Types