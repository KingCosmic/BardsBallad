import { useParams } from 'react-router'

import Header from '@/components/n-header'

import React, { useMemo } from 'react'

import { DataType } from '@/db/system/schema'
import { DataPack } from '@/db/datapack/schema'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { openModal } from '@/state/modals'
import { useVersionResource } from '@/hooks/versions/useVersionResource'

// import SaveNewVersion from '@/modals/SaveNewVersion'
import { useDatapack } from '@/hooks/datapacks/useDatapack'
import EditSystemData from '@/modals/editors/edit-system-data'
import storeMutation from '@/db/version/methods/storeMutation'
import { produce } from 'immer'
import { Spinner } from '@/components/ui/spinner'

const DataPackEditor: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const edits_id = useMemo(() => id ? `${id}|edits` : undefined, [id])

  const original = useVersionResource<DataPack>(id)
  const versionEdits = useVersionEdits<DataPack>(edits_id)
  const datapack = useDatapack(versionEdits?.reference_id)

  if (!edits_id || !original || !versionEdits || !datapack) {
    return (
      <div className='flex gap-2'>
        <Spinner />
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full'>
      <Header title={datapack.name} subtitle='Datapack'
        // options={[{
        //   onClick: () =>
        //     openModal('save-new-version', ({ id: modalID }) => (
        //       <SaveNewVersion id={modalID} original={original} edits={versionEdits} edits_id={edits_id} />
        //     )),
        //   Content: () => <p className='block cursor-pointer py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'>Save Version</p>
        // }]}
      />

      <div className='p-4 relative flex flex-col grow'>
        {/* TODO: Searchbar */}

        <div className='flex flex-col gap-1'>
          {
            versionEdits.data.packData.map((data: DataType) => {
              return (
                <div key={data.name} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer'
                  onClick={() => openModal('edit-pack-data', ({ id }) => (
                    <EditSystemData
                      id={id}
                      types={versionEdits.data.types}
                      onSave={(newData) => storeMutation(edits_id,
                        produce(versionEdits.data, draft => {
                          const index = draft.packData.findIndex((d => d.name === data.name))

                          if (index === -1) return

                          if (data.name !== newData.name) {
                            draft.packData.splice(index, 1)
                            draft.packData.push(newData)
                          } else {
                            draft.packData[index] = newData
                          }
                        })
                      )}
                      data={data}
                    />
                  ))}
                >
                  <p>{data.name} - {data.typeData.type} {data.typeData.isArray ? '(Array)' : ''}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default DataPackEditor