import { useState } from 'react'

import { type System } from '../../storage/schemas/system'

import { produce } from 'immer'
import EditSystemData from '../../modals/EditSystemData'
import FloatingActionButton from '../../components/FloatingActionButton'
import { setDefaultCharacterData } from '../../storage/methods/systems'

import { type SystemType, type TypeData, type DataType } from '../../storage/schemas/system'
import { VersionedResource } from '../../storage/schemas/versionedResource'

type CharacterProps = {
  system: System
  versionedResource: VersionedResource
}

const Character: React.FC<CharacterProps> = ({ system, versionedResource }) => {
  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      <EditSystemData
        types={versionedResource.data.types}
        onDelete={() => {
          const newCopy = produce(versionedResource.data.defaultCharacterData, (draft: any) => {
            delete draft[editData?.name || '']

            draft._type.properties = draft._type.properties.filter((prop: any) => prop.key !== editData?.name)
          })

          setDefaultCharacterData(system.local_id, newCopy!)
        }}
        onSave={(newData) => {
          const key = newData.name
          const typeData = newData.typeData
          const value = newData.data

          const newCopy = produce(versionedResource.data.defaultCharacterData, (draft: any) => {
            delete draft[editData?.name || '']

            draft[key] = value
            
            for (let i = 0; i < draft._type.properties.length; i++) {
              const type = (draft._type.properties[i] as { key: string; typeData: TypeData })

              if (type.key !== editData?.name) continue

              type.key = key
              type.typeData = typeData
            }
          })

          setDefaultCharacterData(versionedResource.local_id, newCopy!)
        }}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />

      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {
          (versionedResource.data.defaultCharacterData._type as SystemType).properties.map((prop) => {
            const key = prop.key
            const data = versionedResource.data.defaultCharacterData[key]

            const def = prop.typeData

            let type = data._type ? undefined : def.type

            return (
              <div key={key} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer'
                onClick={() => setEditData({ name: key, typeData: def, data })}
              >
                <p>{key} - {type} {def.isArray ? '(Array)' : ''}</p>
              </div>
            )
          })
        }
      </div>

      <FloatingActionButton onClick={() => {
          const newCopy = {
            ...versionedResource.data.defaultCharacterData,
            newKey: 'new value',
            _type: {
              name: versionedResource.data.defaultCharacterData._type.name || '',
              properties: [
                ...versionedResource.data.defaultCharacterData._type.properties || [],
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

          setDefaultCharacterData(versionedResource.local_id, newCopy)
        }}
      />
    </>
  )
}

export default Character