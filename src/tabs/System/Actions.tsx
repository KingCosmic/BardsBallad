import DropdownButton from '@components/DropdownButton'
import FloatingActionButton from '@components/FloatingActionButton'
import BlueprintEditor from '@modals/BlueprintEditor'
import ConfirmModal from '@modals/ConfirmModal'
import EditStringModal from '@modals/EditString'
import addCharacterAction from '@mutations/system/addCharacterAction'
import deleteAction from '@mutations/system/deleteAction'
import editActionBlueprint from '@mutations/system/editActionBlueprint'
import editActionDescription from '@mutations/system/editActionDescription'
import editActionName from '@mutations/system/editActionName'
import { openModal } from '@state/modals'
import storeMutation from '@storage/methods/versionedresources/storeMutation'
import { ActionType } from '@storage/schemas/system'
import { VersionedResource } from '@storage/schemas/versionedResource'

interface Props {
  editsId: string
  versionedResource: VersionedResource
}

const ActionsModal: React.FC<Props> = ({ editsId, versionedResource }) => {
  return (
    <>
      <div className='flex flex-col gap-2'>
        {versionedResource.data.actions?.map((action: ActionType, index: number) => {
          return (
            <div key={index} className='flex bg-neutral-700 rounded border border-neutral-600 p-3'>
              <div className='flex flex-col flex-grow gap-1'>
                <p>{action.name}</p>
                <p>{action.description}</p>
              </div>
              <DropdownButton label='Edit' onClick={() =>
                openModal('blueprint', ({ id }) => (
                  <BlueprintEditor id={id} data={action.blueprint} onSave={bp => storeMutation(editsId, editActionBlueprint(versionedResource.data, action.name, bp))} />
                ))}
                options={[
                {
                  label: 'Rename',
                  onClick: () => openModal('edit-string', ({ id }) => (
                    <EditStringModal id={id} title='Edit Action Name' data={action.name} onSave={newName => storeMutation(editsId, editActionName(versionedResource.data, action.name, newName))} />
                  ))
                },
                {
                  label: 'Change Description',
                  onClick: () => openModal('edit-string', ({ id }) => (
                    <EditStringModal id={id} title='Edit Action Description' data={action.description} onSave={description => storeMutation(editsId, editActionDescription(versionedResource.data, action.name, description))} />
                  ))
                },
                {
                  label: 'delete',
                  onClick: () => openModal('confirm', ({ id }) => (
                    <ConfirmModal id={id} title='Delete Action' type='danger' message='Are you sure you want to delete this action?' onConfirm={() => storeMutation(editsId, deleteAction(versionedResource.data, action.name))} />
                  ))
                }
              ]} />
            </div>
          )
        })}
      </div>

      <FloatingActionButton onClick={async () => {
        await storeMutation(editsId, addCharacterAction(versionedResource.data, 'New Action'))
      }} />
    </>
  )
}

export default ActionsModal
