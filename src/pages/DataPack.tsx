import { useNavigate, useParams } from 'react-router'

import Header from '@components/Header'

import React, { useMemo, useState } from 'react'
import { DataType } from '@storage/schemas/system'
import { DataPack } from '@storage/schemas/datapack'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { openModal } from '@state/modals'
import duplicateVersionedResource from '@storage/methods/versionedresources/duplicateVersionedResource'
import createSubscription from '@storage/methods/subscriptions/createSubscription'
import { useVersionResource } from '@hooks/useVersionResource'
import SaveNewVersion from '@modals/SaveNewVersion'
import { useDatapack } from '@hooks/useDatapack'
import EditSystemData from '@modals/EditSystemData'
import storeMutation from '@storage/methods/versionedresources/storeMutation'
import { produce } from 'immer'
import { addToast } from '@state/toasts'

const DataPackEditor: React.FC = () => {
  const { id } = useParams<{ id: string; }>()
  let navigate = useNavigate();

  const edits_id = useMemo(() => id ? `${id}|edits` : undefined, [id])

  const original = useVersionResource<DataPack>(id)
  const versionEdits = useVersionEdits<DataPack>(edits_id)
  const datapack = useDatapack(versionEdits?.reference_id)

  const [editData, setEditData] = useState<DataType | null>(null)

  if (!edits_id) return <>id not defined...</>
  if (!original) return <>Loading Original</>
  if (!versionEdits) return <>Loading Edits...</>
  if (!datapack) return <>Loading System...</>

  return (
    <div className='flex flex-col h-full'>
      <Header title={datapack.name} options={[{
        onClick: () =>
          openModal('save-new-version', ({ id: modalID }) => (
            <SaveNewVersion id={modalID} original={original} edits={versionEdits} edits_id={edits_id} />
          )),
        Content: () => <p className='block cursor-pointer py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'>Save Version</p>
      }]} />

      <div className='p-4 relative flex flex-col flex-grow'>
        <EditSystemData
          types={versionEdits.data.types}
          onSave={(newData) => storeMutation(edits_id,
            produce(versionEdits.data, draft => {
              const index = draft.packData.findIndex((data => data.name === editData!.name))

              if (index === -1) return

              if (editData!.name !== newData.name) {
                draft.packData.splice(index, 1)
                draft.packData.push(newData)
              } else {
                draft.packData[index] = newData
              }
            })
          )}
          isVisible={(editData !== null)}
          requestClose={() => setEditData(null)}
          data={editData!}
        />

        {/* TODO: Searchbar */}

        <div className='flex flex-col gap-1'>
          {
            versionEdits.data.packData.map((data: DataType) => {
              return (
                <div key={data.name} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer'
                  onClick={() => setEditData(data)}
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
