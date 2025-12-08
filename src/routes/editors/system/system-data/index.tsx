
import { Button } from '@/components/ui/button'
import FloatingActionButton from '@/components/ui/fab'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
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
        {(versionedResource.data as any).data.map((data: DataType) => (
          <Item variant='muted'>
            <ItemContent>
              <ItemTitle>{data.name}</ItemTitle>
              <ItemDescription>
                {data.typeData.type} {data.typeData.isArray ? '(Array)' : ''}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant='outline' size='sm' onClick={() =>
                openModal('edit-system-data', ({ id }) => (
                  <EditSystemData
                    id={id}
                    types={(versionedResource.data as any).types}
                    onDelete={() => storeMutation(editsId, deleteSystemData(versionedResource.data as any, data.name))}
                    onSave={(newData) => storeMutation(editsId, updateSystemData(versionedResource.data as any, data.name, newData))}
                    data={data}
                  />
                ))
              }>
                Edit
              </Button>
            </ItemActions>
          </Item>
        ))}
      </div>

      <FloatingActionButton onClick={() => storeMutation(editsId, addSystemData(versionedResource.data as any))} />
    </>
  )
}

export default SystemData