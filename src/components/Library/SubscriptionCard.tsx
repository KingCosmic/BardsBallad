import { type UserSubscription } from '@storage/schemas/userSubscription'
import { useSubscriptionData } from '@hooks/useSubscriptionData'
import { authState } from '@state/auth'
import createSubscription from '@storage/methods/subscriptions/createSubscription'
import createVersionedResource from '@storage/methods/versionedresources/createVersionedResource'
import { VersionedResource } from '@storage/schemas/versionedResource'
import { useNavigate } from 'react-router'
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID'
import JSONToFile from '@utils/JSONToFile'
import DropdownButton from '@components/DropdownButton'
import ConfirmModal from '@modals/ConfirmModal'

import { openModal } from '@state/modals'
import { addToast } from '@state/toasts'
import deleteVersionedResource from '@storage/methods/versionedresources/deleteVersionedResource'
import { db, Item } from '@storage/index'
import createItem from '@utils/items/createItem'
import deleteItem from '@utils/items/deleteItem'
import { useState } from 'react'
import getVersionedResource from '@storage/methods/versionedresources/getVersionedResource'
import ButtonWithDropdown from '@components/ButtonWithDropdown'
import deleteSubscription from '@storage/methods/subscriptions/deleteSubscription'
import storeHashes from '@storage/methods/hashes/storeHashes'
import generateTypeHash from '@utils/generateTypeHash'

type Props = {
  itemData: Item;
  subs: UserSubscription[];
}

const forkItem = async (baseData: Item, versionData: VersionedResource) => {
  const newItem = await createItem(versionData.reference_type, baseData)

  if (!newItem) {
    return addToast('Error creating forked content, try again.', 'error')
  }

  const newVers = await createVersionedResource(
    versionData.reference_type,
    newItem.local_id,
    versionData.data
  )

  if (!newVers) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    return addToast('Error creating new version data for forked content, cleaning up...', 'error')
  }

  const hashes = await storeHashes(newVers.local_id, newVers.data.types.map(generateTypeHash))

  if (!hashes) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    deleteVersionedResource(newVers.local_id, true)
    return addToast('Error creating hashes for forked content, cleaning up...', 'error')
  }

  const newSub = await createSubscription(
    versionData.reference_type,
    newItem.local_id,
    newVers.local_id,
    false
  )

  if (!newSub) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    deleteVersionedResource(newVers.local_id, true)
    db.typeHashes.delete(newVers.local_id)
    return addToast('Error creating subscription for forked content, cleaning up...', 'error')
  }
}

const SubscriptionCard: React.FC<Props> = ({ subs, itemData }) => {
  let navigate = useNavigate()

  const { user } = authState.useValue();

  const [isOpen, setIsOpen] = useState(false)

  // we are considered the owner if our user id's match or if the subscription doesn't have a user id and server provided id
  const isOwner =
    (user && itemData.user_id && user.id === itemData.user_id) ||
    (!user && itemData.user_id === 'none');
  
  const LatestStatus = 'bg-[#065f46] text-[#10b981]'

  return (
    <div className='fantasy-card-gradient card-top-border border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-fantasy-accent-dark rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-fantasy-text">
              {itemData.name[0]}
            </span>
          </div>
          <div>
            <div className='text-lg font-semibold text-fantasy-text'>{itemData.name}</div>
          </div>
        </div>
        <div className='bg-fantasy-dark border border-fantasy-medium text-fantasy-text rounded-md text-xs font-medium px-1 py-2'>{subs.length} versions</div>
      </div>
      
      <div className='mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm text-fantasy-text-muted'>Latest: {new Date(subs[0].subscribed_at).toLocaleDateString()} - {new Date(subs[0].subscribed_at).toLocaleTimeString()}</span>
            <button className='bg-none border-none text-fantasy-accent cursor-pointer text-xs p-0 underline ml-auto' onClick={() => setIsOpen(!isOpen)}>Show all versions</button>
          </div>
          
          <div className={`transition-all overflow-hidden ${isOpen ? 'max-h-60 overflow-y-auto border border-fantasy-border mt-2 rounded-md' : 'max-h-12'}`}>
            {subs.map((sub, i) => (
              <div key={i} className={`flex items-center justify-between p-2 transition-all border-b border-solid border-fantasy-medium ${isOpen ? 'p-3' : 'h-12'} ${i > 0 ? '' : 'bg-gradient-to-r from-green-900 to-transparent'}`}>
                <div className='flex flex-col gap-1'>
                  <div className='text-sm text-neutral-200'>{getVisualTextFromVersionID(sub.version_id)}</div>
                  <div className='text-xs text-neutral-400'>{new Date(sub.subscribed_at).toLocaleDateString()} - {new Date(sub.subscribed_at).toLocaleTimeString()}</div>
                </div>
                <div className={`px-1 py-2 rounded text-xs font-medium ${i > 0 ? '' : LatestStatus} ${isOpen ? 'hidden' : ''}`}>{i > 0 ? 'Active' : 'Latest'}</div>
                <div className={`${isOpen ? '' : 'hidden'}`}>
                  <DropdownButton label='⚙️' options={[
                      {
                        label: isOwner ? 'Edit' : 'Fork',
                        onClick: async () => {
                          if (isOwner) {
                            // direct to editor.
                            return navigate(
                              `/library/${sub.resource_type}/${sub.version_id}`
                            );
                          }

                          const versionData = await getVersionedResource(sub.version_id)

                          if (!versionData) return addToast('Error grabbing data to fork.', 'error')

                          // fork
                          return forkItem(itemData, versionData);
                        }
                      },
                      {
                        label: 'Export',
                        onClick: async () => {
                          const versionData = await getVersionedResource(sub.version_id)

                          if (!versionData) return addToast('Error grabbing version data to export.', 'error')

                          JSONToFile(
                            versionData.reference_type,
                            {
                              item: itemData,
                              version: versionData,
                            },
                            `${itemData.name}-${versionData.local_id}`
                          )
                        }
                      },
                      {
                        label: 'Delete',
                        onClick: () => openModal('delete-subscription', ({ id }) => ( 
                            <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?'
                            onConfirm={() => deleteSubscription(sub.local_id)} />
                          )
                        )
                      }
                    ]} />
                </div>
              </div>
            ))}
          </div>
      </div>
      
      <div className={`flex transition-all ${isOpen ? 'h-0 w-0 overflow-hidden' : ''}`}>
        <ButtonWithDropdown label={isOwner ? 'Edit' : 'Fork'} onClick={async () => {
            const latestVersion = await getVersionedResource(subs[0].version_id)

            if (!latestVersion) return addToast('Error grabbing version info.', 'error')

            if (isOwner) {
              // direct to editor.
              return navigate(
                `/library/${latestVersion.reference_type}/${latestVersion.local_id}`
              );
            }

            // fork
            return forkItem(itemData, latestVersion);
          }}
          options={[
            {
              label: 'Export',
              onClick: async () => {
                const latestVersion = await getVersionedResource(subs[0].version_id)

                if (!latestVersion) return addToast('Error grabbing version info.', 'error')

                JSONToFile(
                  latestVersion.reference_type,
                  {
                    item: itemData,
                    version: latestVersion,
                  },
                  `${itemData.name}-${latestVersion.local_id}`
                )
              }
            },
            {
              label: 'Delete',
              onClick: () => openModal('delete-subscription', ({ id }) => (
                  <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?'
                  onConfirm={() => deleteSubscription(subs[0].local_id)} />
                )  
              )
            }
          ]}
        />
      </div>
    </div>
  )
};

export default SubscriptionCard;
