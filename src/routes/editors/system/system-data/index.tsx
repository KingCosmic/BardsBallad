
import FloatingActionButton from '@/components/ui/fab'
import addSystemData from '@/db/system/methods/addSystemData'
import deleteSystemData from '@/db/system/methods/deleteSystemData'
import updateSystemData from '@/db/system/methods/updateSystemData'
import { DataType } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import { VersionedResource } from '@/db/version/schema'
import EditSystemData from '@/modals/editors/edit-system-data'
import { openModal } from '@/state/modals'
import React from 'react'

type DataProps = {
  editsId: string
  versionedResource: VersionedResource
}

const SystemData: React.FC<DataProps> = ({ editsId, versionedResource }) => {
  return (
    <>
      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {
          (versionedResource.data as any).data.map((data: DataType) => {
            return (
              <div key={data.name} className='mb-4 block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 cursor-pointer'
                onClick={() => openModal('edit-system-data', ({ id }) => (
                  <EditSystemData
                    id={id}
                    types={(versionedResource.data as any).types}
                    onDelete={() => storeMutation(editsId, deleteSystemData(versionedResource.data as any, data.name))}
                    onSave={(newData) => storeMutation(editsId, updateSystemData(versionedResource.data as any, data.name, newData))}
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

      <FloatingActionButton onClick={() => storeMutation(editsId, addSystemData(versionedResource.data as any))} />
    </>
  )
}

export default SystemData