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
import { Item } from '@storage/index'
import createItem from '@utils/items/createItem'
import deleteItem from '@utils/items/deleteItem'
import { useState } from 'react'
import getVersionedResource from '@storage/methods/versionedresources/getVersionedResource'

type Props = {
  itemData: Item;
  versions: UserSubscription[];
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

  const newSub = await createSubscription(
    versionData.reference_type,
    newItem.local_id,
    newVers.local_id,
    false
  )

  if (!newSub) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    deleteVersionedResource(newVers.local_id, true)
    return addToast('Error creating subscription for forked content, cleaning up...', 'error')
  }
}

const SubscriptionCard: React.FC<Props> = ({ versions, itemData }) => {
  let navigate = useNavigate()

  const { user } = authState.useValue();

  const [isOpen, setIsOpen] = useState(false)

  // we are considered the owner if our user id's match or if the subscription doesn't have a user id and server provided id
  const isOwner =
    (user && itemData.user_id && user.id === itemData.user_id) ||
    (!user && itemData.user_id === 'none');
  
  const LatestStatus = 'bg-[#065f46] text-[#10b981]'

  return (
    <div className='rounded-xl p-5 border border-solid border-neutral-700 transition-all hover:-translate-y-px'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
           <span className="text-xl font-bold text-white">
              {itemData.name[0]}
             </span>
            </div>
          <div>
            <div className='text-lg font-semibold text-white'>{itemData.name}</div>
          </div>
        </div>
        <div className='bg-neutral-800 text-neutral-200 rounded-md text-xs font-medium px-1 py-2'>{versions.length} versions</div>
      </div>
      
      <div className='mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm text-neutral-300'>Latest: {new Date(versions[0].subscribed_at).toLocaleDateString()} - {new Date(versions[0].subscribed_at).toLocaleTimeString()}</span>
            <button className='bg-none border-none text-brand-500 cursor-pointer text-xs p-0 underline ml-auto' onClick={() => setIsOpen(!isOpen)}>Show all versions</button>
          </div>
          
          <div className={`transition-all overflow-hidden ${isOpen ? 'max-h-60 overflow-y-auto border border-neutral-700 mt-2 rounded-md' : 'max-h-12'}`}>
            {versions.map((ver, i) => (
              <div className={`flex items-center justify-between p-2 transition-all border-b border-solid border-neutral-800 ${isOpen ? 'p-3' : 'h-12'} ${i > 0 ? '' : 'bg-gradient-to-r from-green-900 to-transparent'}`}>
                <div className='flex flex-col gap-1'>
                  <div className='text-sm text-neutral-200'>{getVisualTextFromVersionID(ver.local_id)}</div>
                  <div className='text-xs text-neutral-400'>{new Date(ver.subscribed_at).toLocaleDateString()} - {new Date(ver.subscribed_at).toLocaleTimeString()}</div>
                </div>
                <div className={`px-1 py-2 rounded text-xs font-medium ${i > 0 ? '' : LatestStatus} ${isOpen ? 'hidden' : ''}`}>{i > 0 ? 'Active' : 'Latest'}</div>
                <div className={`${isOpen ? '' : 'hidden'}`}>
                  <DropdownButton label={isOwner ? 'Edit' : 'Fork'} onClick={async () => {
                      const latestVersion = await getVersionedResource(versions[0].version_id)

                      if (!latestVersion) return addToast('Error grabbing version info.', 'error')

                      if (isOwner) {
                        // direct to editor.
                        return navigate(
                          `/library/${latestVersion.reference_type}/${latestVersion.local_id}`
                        );
                      }

                      // fork
                      return forkItem(itemData, latestVersion);
                    }} options={[
                      {
                        label: 'Export',
                        onClick: async () => {
                          const latestVersion = await getVersionedResource(versions[0].version_id)

                          if (!latestVersion) return addToast('Error grabbing version info.', 'error')

                          JSONToFile(
                            {
                              system: itemData,
                              version: latestVersion,
                            },
                            `${itemData.name}-${latestVersion.local_id}`
                          )
                        }
                      },
                      {
                        label: 'Delete',
                        onClick: () => openModal('delete-subscription', ({ id }) => <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?' onConfirm={() => {}} />)
                      }
                    ]} />
                </div>
              </div>
            ))}
          </div>
      </div>
      
      <div className={`flex transition-all ${isOpen ? 'h-0 w-0 overflow-hidden' : ''}`}>
        <DropdownButton label={isOwner ? 'Edit' : 'Fork'} onClick={async () => {
          const latestVersion = await getVersionedResource(versions[0].version_id)

          if (!latestVersion) return addToast('Error grabbing version info.', 'error')

          if (isOwner) {
            // direct to editor.
            return navigate(
              `/library/${latestVersion.reference_type}/${latestVersion.local_id}`
            );
          }

          // fork
          return forkItem(itemData, latestVersion);
        }} options={[
          {
            label: 'Export',
            onClick: async () => {
              const latestVersion = await getVersionedResource(versions[0].version_id)

              if (!latestVersion) return addToast('Error grabbing version info.', 'error')

              JSONToFile(
                {
                  system: itemData,
                  version: latestVersion,
                },
                `${itemData.name}-${latestVersion.local_id}`
              )
            }
          },
          {
            label: 'Delete',
            onClick: () => openModal('delete-subscription', ({ id }) => <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?' onConfirm={() => {}} />)
          }
        ]} />
      </div>
    </div>
  )

  // return (
  //   <div
  //     key={subscription.local_id}
  //     className="relative flex flex-col max-w-96 p-4 transition-all duration-200 bg-white border rounded-xl hover:shadow-lg dark:bg-neutral-800 dark:border-neutral-700 hover:transform hover:scale-[1.02]"
  //   >
  //     <div className="flex items-start space-x-4">
  //       <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
  //         <span className="text-xl font-bold text-white">
  //           {baseData.name[0]}
  //         </span>
  //       </div>

  //       <div className="flex-1 min-w-0">
  //         <h5 className="text-xl font-semibold text-neutral-900 truncate dark:text-white">
  //           {baseData.name}
  //         </h5>
  //         <p className="text-sm text-neutral-500 dark:text-neutral-400">
  //           Version {getVisualTextFromVersionID(versionData.local_id)}
  //         </p>
  //       </div>
  //     </div>

  //     <div className="flex justify-between items-center gap-2 mt-4 border-t pt-3 dark:border-neutral-700">
  //       <p>{new Date(versionData.created_at).toDateString()}</p>
  //       <DropdownButton label={isOwner ? 'Edit' : 'Fork'} onClick={() => {
  //           if (isOwner) {
  //             // direct to editor.
  //             return navigate(
  //               `/library/${subscription.resource_type}/${versionData.local_id}`
  //             );
  //           }

  //           // fork
  //           return forkItem(baseData, versionData);
  //         }} options={[
  //           {
  //             label: 'Export',
  //             onClick: () => JSONToFile(
  //               {
  //                 system: query.baseData,
  //                 version: query.versionData,
  //               },
  //               `${query.baseData.name}-${query.versionData.local_id}`
  //             )
  //           },
  //           {
  //             label: 'Delete',
  //             onClick: () => openModal('delete-subscription', ({ id }) => <ConfirmModal id={id} title='Delete Subscription' type='danger' message='Are you sure you want to delete this subscription?' onConfirm={() => {}} />)
  //           }
  //         ]} />
  //     </div>
  //   </div>
  // );
};

export default SubscriptionCard;

