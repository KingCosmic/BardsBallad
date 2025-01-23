import { setDefaultCharacterData, systemState } from '../../state/system'

import { useState } from 'react'
import { DataType, SystemType, TypeData } from '../../state/systems'

import { produce } from 'immer'
import EditSystemData from '../../modals/EditSystemData'
import FloatingActionButton from '../../components/FloatingActionButton'

function Character() {
  const system = systemState.useValue()

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
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

      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {
          (system?.defaultCharacterData._type as SystemType).properties.map((prop) => {
            const key = prop.key
            const data = system?.defaultCharacterData[key]

            const def = prop.typeData

            let type = data._type ? undefined : def.type

            return (
              <div key={key} className='p-4 bg-neutral-900 hover:bg-neutral-800 cursor-pointer'
                onClick={() => setEditData({ name: key, typeData: def, data })}
              >
                <p>{key} - {type}{def.isArray ? '(Array)' : ''}</p>
              </div>
            )
          })
        }
      </div>

      <FloatingActionButton onClick={() => {
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
        }}
      />
    </>
  )
}

export default Character