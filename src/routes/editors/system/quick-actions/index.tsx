import { Button } from '@/components/ui/button'
import { DropdownButton } from '@/components/ui/dropdown-button'
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import FloatingActionButton from '@/components/ui/fab'
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader } from '@/components/ui/item'
import addCharacterAction from '@/db/system/methods/addCharacterAction'
import deleteAction from '@/db/system/methods/deleteAction'
import editActionDescription from '@/db/system/methods/editActionDescription'
import editActionName from '@/db/system/methods/editActionName'
import editActionScript from '@/db/system/methods/editActionScript'
import { ActionType, SystemType } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import { VersionedResource } from '@/db/version/schema'
import ConfirmModal from '@/modals/confirm'
import EditString from '@/modals/editors/edit-string'
import ScriptEditor from '@/modals/editors/script-editor'
import { openModal } from '@/state/modals'
import { useMemo } from 'react'

interface Props {
  editsId: string
  versionedResource: VersionedResource
}

const QuickActions: React.FC<Props> = ({ editsId, versionedResource }) => {

  const types: SystemType[] = useMemo(() => [
    // character data
    (versionedResource?.data as any).defaultCharacterData._type,
    // system data
    { name: 'SystemData', properties: (versionedResource?.data as any).data.map((d: any) => ({ key: d.name, typeData: d.typeData })) },
    // "page data",
    { name: 'PageData', properties: [] },
    // all custom types.
    ...((versionedResource?.data as any).types ?? [])
  ], [versionedResource])

  return (
    <>
      <div className='flex flex-col gap-2'>
        {(versionedResource.data as any).actions?.map((action: ActionType) => {
          return (
            <Item key={action.name} variant='outline'>
              <ItemHeader>{action.name}</ItemHeader>
              <ItemContent>
                <ItemDescription>
                  {action.description}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant='outline' onClick={() => {
                  openModal('script', ({ id }) => (
                    <ScriptEditor id={id} types={types} globals={[]} expectedType='null' code={action.script} onSave={(script) => storeMutation(editsId, editActionScript(versionedResource.data as any, action.name, script.result))} />
                  ))
                }}>
                  Edit
                </Button>
                <DropdownButton label='⚙️'>
                  <DropdownMenuContent className='w-56' align='start'>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => openModal('edit-string', ({ id }) => (
                        <EditString id={id} title='Edit Action Name' data={action.name} onSave={newName => storeMutation(editsId, editActionName(versionedResource.data as any, action.name, newName))} />
                      ))}>
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openModal('edit-string', ({ id }) => (
                        <EditString id={id} title='Edit Action Description' data={action.description} onSave={description => storeMutation(editsId, editActionDescription(versionedResource.data as any, action.name, description))} />
                      ))}>
                        Change Description
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => openModal('confirm', ({ id }) => (
                        <ConfirmModal id={id} title='Delete Quick Action' type='danger' message='Are you sure you want to delete this action?' onConfirm={() => storeMutation(editsId, deleteAction(versionedResource.data as any, action.name))} />
                      ))}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownButton>
              </ItemActions>
            </Item>
          )
        })}
      </div>

      <FloatingActionButton onClick={async () => {
        await storeMutation(editsId, addCharacterAction(versionedResource.data as any, 'New Action'))
      }} />
    </>
  )
}

export default QuickActions