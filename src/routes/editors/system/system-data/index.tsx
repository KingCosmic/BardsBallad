
import { Button } from '@/components/ui/button'
import FloatingActionButton from '@/components/ui/fab'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import addSystemData from '@/db/system/methods/addSystemData'
import deleteSystemData from '@/db/system/methods/deleteSystemData'
import updateSystemData from '@/db/system/methods/updateSystemData'
import { DataType, SystemData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import EditSystemData from '@/modals/editors/edit-system-data'
import { openModal } from '@/state/modals'
import React from 'react'
import * as automerge from '@automerge/automerge'

interface Props {
  editsId: string
  doc: automerge.next.Doc<SystemData>
}

const SystemDataTab: React.FC<Props> = ({ editsId, doc }) => {
  return (
    <>
      {/* TODO: Searchbar */}

      <div className='flex flex-col gap-1'>
        {doc.data.map((data: DataType) => (
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
                    types={doc.types}
                    onDelete={() => storeMutation(editsId, deleteSystemData(doc, data.name))}
                    onSave={(newData) => storeMutation(editsId, updateSystemData(doc, data.name, newData))}
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

      <FloatingActionButton onClick={() => storeMutation(editsId, addSystemData(doc))} />
    </>
  )
}

export default SystemDataTab