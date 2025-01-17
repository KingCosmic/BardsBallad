import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonSearchbar } from '@ionic/react'
import { setDefaultCharacterData, systemState } from '../../state/system'
import EditObject from '../../modals/EditObject'
import { useState } from 'react'
import { DataType, SystemType, TypeData } from '../../state/systems'
import { add } from 'ionicons/icons'
import { produce } from 'immer'
import EditSystemData from '../../modals/EditSystemData'

function Character() {
  const system = systemState.useValue()

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      {/* <EditObject
        title={`Edit ${editData?.key}`}
        types={system?.types || []}
        onDelete={() => {
          const newCopy = produce(dataCopy, (draft: any) => {
            delete draft[editData?.key]

            draft._type.properties = draft._type.properties.filter((prop: any) => prop.key !== editData?.key)
          })

          setDataCopy(newCopy)
        }}
        onSave={(data) => setNestedProperty(dataCopy, editData?.key, data)}
        isVisible={(editData?.data !== null)}
        requestClose={() => setEditData(null)}
        data={editData?.data}
        type={editData?.type}
        typeData={editData?.typeData}
      /> */}

      <EditSystemData
        types={system?.types || []}
        onDelete={() => {
          const newCopy = produce(system?.defaultCharacterData, (draft: any) => {
            delete draft[editData?.name || '']

            draft._type.properties = draft._type.properties.filter((prop: any) => prop.key !== editData?.name)
          })

          setDefaultCharacterData(newCopy!)
        }}
        onSave={(newData) => {
          const key = newData.name
          const typeData = newData.typeData
          const value = newData.data

          console.log(newData)

          const newCopy = produce(system?.defaultCharacterData, (draft: any) => {
            delete draft[editData?.name || '']

            draft[key] = value
            
            for (let i = 0; i < draft._type.properties.length; i++) {
              const type = (draft._type.properties[i] as { key: string; typeData: TypeData })

              if (type.key !== editData?.name) continue

              type.key = key
              type.typeData = typeData
            }
          })

          setDefaultCharacterData(newCopy!)
        }}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />

      <IonSearchbar color='light' />

      {
        (system?.defaultCharacterData._type as SystemType).properties.map((prop) => {
          const key = prop.key
          const data = system?.defaultCharacterData[key]

          const def = prop.typeData

          let type = data._type ? undefined : def.type

          return (
            <IonItem key={key} color='light' onClick={() => {
              // setEditData({ type, typeData: prop.typeData, key, data })
              setEditData({ name: key, typeData: def, data })
            }} button>
              <IonLabel>{key}</IonLabel>
            </IonItem>
          )
        })
      }

      <IonFab slot='fixed' vertical='bottom' horizontal='end'>
        <IonFabButton onClick={() => {
          const newCopy = {
            ...system?.defaultCharacterData,
            newKey: 'new value',
            _type: {
              name: system?.defaultCharacterData?._type?.name || '',
              properties: [
                ...system?.defaultCharacterData?._type?.properties || [],
                {
                  key: 'newKey',
                  typeData: {
                    type: 'string',
                    useTextarea: false,
                    isArray: false
                  }
                }
              ]
            }
          }

          setDefaultCharacterData(newCopy)
        }}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Character