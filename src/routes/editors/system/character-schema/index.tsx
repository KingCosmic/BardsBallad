import React from 'react'

import { produce } from 'immer'
import storeMutation from '@/db/version/methods/storeMutation'
import { SystemData, SystemType, TypeData } from '@/db/system/schema'
import { openModal } from '@/state/modals'
import EditSystemData from '@/modals/editors/edit-system-data'
import setDefaultCharacterData from '@/db/system/methods/setDefaultCharacterData'
import * as automerge from '@automerge/automerge'

interface Props {
  editsId: string
  doc: automerge.next.Doc<SystemData>
}

const CharacterSchema: React.FC<Props> = ({ editsId, doc }) => {
  return (
    <>
      {/* TODO: Searchbar */}

      {/* Data Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>

        {/* Add Data card */}
        <div
          className="fantasy-add-gradient border-2 border-dashed border-fantasy-accent/30 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col justify-center items-center hover:border-fantasy-accent/60 hover:fantasy-add-gradient hover:-translate-y-1"
          onClick={() => {
            const newCopy = {
              ...doc.defaultCharacterData as any,
              newKey: 'new value',
              _type: {
                name: (doc.defaultCharacterData as any)._type.name || '',
                properties: [
                  {
                    key: 'newKey',
                    typeData: {
                      type: 'string',
                      useTextarea: false,
                      isArray: false
                    }
                  },
                  ...(doc.defaultCharacterData as any)._type.properties || []
                ]
              }
            }

            storeMutation(editsId, setDefaultCharacterData(doc, newCopy))
          }}
        >
          <div className="text-fantasy-accent/80 text-base font-medium">Create New Property</div>
        </div>

        {
          ((doc.defaultCharacterData as any)._type as SystemType).properties.map((prop) => {
            const key = prop.key
            const data = (doc.defaultCharacterData as any)[key]

            const def = prop.typeData

            let type = data._type ? undefined : def.type

            return (
              <div key={key} className='fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'
                onClick={() => openModal('edit-character-schema', ({ id }) => {
                  const editData = { name: key, typeData: def, data }

                  return (
                    <EditSystemData id={id}
                      types={doc.types}
                      onDelete={() => {
                        const newCopy = produce(doc.defaultCharacterData, (draft: any) => {
                          delete draft[editData.name || '']

                          draft._type.properties = draft._type.properties.filter((prop: any) => prop.key !== editData?.name)
                        }) as Record<string, any>

                        storeMutation(editsId, setDefaultCharacterData(doc, newCopy))
                      }}
                      onSave={(newData) => {
                        const key = newData.name
                        const typeData = newData.typeData
                        const value = newData.data

                        const newCopy = produce(doc.defaultCharacterData, (draft: any) => {
                          delete draft[editData?.name || '']

                          draft[key] = value

                          for (let i = 0; i < draft._type.properties.length; i++) {
                            const type = (draft._type.properties[i] as { key: string; typeData: TypeData })

                            if (type.key !== editData?.name) continue

                            type.key = key
                            type.typeData = typeData
                          }
                        }) as Record<string, any>

                        storeMutation(editsId, setDefaultCharacterData(doc, newCopy))
                      }}
                      data={editData}
                    />
                  )
                })}
              >
                <p>{key} - {type} {def.isArray ? '(Array)' : ''}</p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default CharacterSchema