
import { addSystemData, deleteSystemData, systemState, updateSystemData } from '../../state/system'
import { useState } from 'react'
import { DataType } from '../../state/systems'
import EditSystemData from '../../modals/EditSystemData'
import FloatingActionButton from '../../components/FloatingActionButton'

function Data() {
  const system = systemState.useValue()

  const [editData, setEditData] = useState<DataType | null>(null)

  return (
    <>
      <EditSystemData
        types={system?.types || []}
        onDelete={() => deleteSystemData(editData!.name)}
        onSave={(newData) => updateSystemData(editData!.name, newData)}
        isVisible={(editData !== null)}
        requestClose={() => setEditData(null)}
        data={editData!}
      />
      
      {/* TODO: Searchbar */}

      {
        system?.data.map((data) => {
          return (
            <div key={data.name} onClick={() => setEditData(data)}>
              <p>{data.name}</p>
            </div>
          )
        })
      }

      <FloatingActionButton onClick={addSystemData} />
    </>
  )
}

export default Data