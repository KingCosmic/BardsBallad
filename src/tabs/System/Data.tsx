
import { useState } from 'react'
import EditSystemData from '../../modals/EditSystemData'
import FloatingActionButton from '../../components/FloatingActionButton'
import { updateSystemData, deleteSystemData, addSystemData } from '../../storage/methods/systems'

import { type System, type DataType } from '../../storage/schemas/system'

type DataProps = {
  system: System
}

const Data: React.FC<DataProps> = ({ system }) => {

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      <EditSystemData
        types={system.types}
        onDelete={() => deleteSystemData(system.local_id, editData!.name)}
        onSave={(newData) => updateSystemData(system.local_id, editData!.name, newData)}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />
      
      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {
          system?.data.map((data) => {
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

      <FloatingActionButton onClick={() => addSystemData(system.local_id)} />
    </>
  )
}

export default Data