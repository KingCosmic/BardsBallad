
import { useState } from 'react'
import EditSystemData from '../../modals/EditSystemData'
import FloatingActionButton from '../../components/FloatingActionButton'
import { updateSystemData, deleteSystemData, addSystemData } from '../../utils/system'

import { type System, type DataType } from '../../storage/schemas/system'
import { VersionedResource } from '../../storage/schemas/versionedResource'
import storeMutation from '../../storage/methods/versionedresources/storeMutation'

type DataProps = {
  system: System
  versionedResource: VersionedResource
}

const Data: React.FC<DataProps> = ({ system, versionedResource }) => {

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      <EditSystemData
        types={versionedResource.data.types}
        onDelete={() => storeMutation(versionedResource.local_id, deleteSystemData(versionedResource.data, editData!.name))}
        onSave={(newData) => storeMutation(versionedResource.local_id, updateSystemData(versionedResource.data, editData!.name, newData))}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />
      
      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {
          versionedResource.data.data.map((data: DataType) => {
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

      <FloatingActionButton onClick={() => storeMutation(versionedResource.local_id, addSystemData(versionedResource.data))} />
    </>
  )
}

export default Data