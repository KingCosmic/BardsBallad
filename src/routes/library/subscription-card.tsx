import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { db, Item } from "@/db";
import createItem from "@/db/shared/methods/createItem";
import deleteItem from "@/db/shared/methods/deleteItem";
import renameItem from '@/db/shared/methods/renameItem';
import createSubscription from "@/db/subscription/methods/createSubscription";
import deleteSubscription from "@/db/subscription/methods/deleteSubscription";
import generateTypeHash from "@/db/typeHashes/methods/generateTypeHash";
import storeHashes from "@/db/typeHashes/methods/storeHashes";
import createVersionedResource from "@/db/version/methods/createVersionedResource";
import deleteVersionedResource from "@/db/version/methods/deleteVersionedResource";
import getVersionedResource from "@/db/version/methods/getVersionedResource";
import { VersionedResource } from "@/db/version/schema";
import { Grouped } from '@/hooks/subscriptions/useSubscriptionsWithData';
import ConfirmModal from "@/modals/confirm";
import EditString from '@/modals/editors/edit-string';
import { authState } from "@/state/auth";
import { openModal } from "@/state/modals";
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID";
import JSONToFile from "@/utils/object/JSONToFile";
import { useState } from "react";
import { useNavigate } from "react-router";

type Props = {
  grouped: Grouped;
}

const forkItem = async (baseData: Item, versionData: VersionedResource) => {
  const newItem = await createItem(versionData.reference_type, baseData)

  if (!newItem) {
    return
  }

  const newVers = await createVersionedResource(
    versionData.reference_type,
    newItem.local_id,
    versionData.data
  )

  if (!newVers) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    return
  }

  const hashes = await storeHashes(newVers.local_id, newVers.data.types.map(generateTypeHash))

  if (!hashes) {
    deleteItem(versionData.reference_type, newItem.local_id, true)
    deleteVersionedResource(newVers.local_id, true)
    return
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
    return
  }
}

const SubscriptionCard: React.FC<Props> = ({ grouped }) => {
  let navigate = useNavigate()

  const { subscriptions: subs, item, type } = grouped;

  const { user } = authState.useValue();

  const [isOpen, setIsOpen] = useState(false)

  // we are considered the owner if our user id's match or if the subscription doesn't have a user id and server provided id
  const isOwner =
    (user && item.user_id && user.id === item.user_id) ||
    (!user && item.user_id === 'none');

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm text-muted-foreground'>Latest: {new Date(subs[0].subscribed_at).toLocaleDateString()} - {new Date(subs[0].subscribed_at).toLocaleTimeString()}</span>
            <button className='bg-none border-none cursor-pointer text-xs p-0 underline ml-auto' onClick={() => setIsOpen(!isOpen)}>Show all versions</button>
          </div>
          
          <div className={`transition-all overflow-hidden ${isOpen ? 'max-h-60 overflow-y-auto border border-fantasy-border mt-2 rounded-md' : 'max-h-12'}`}>
            {subs.map((sub, i) => (
              <div key={i} className={`flex items-center justify-between p-2 transition-all border-b border-solid border-fantasy-medium ${isOpen ? 'p-3' : 'h-12'} ${i > 0 ? '' : 'bg-linear-to-r from-success to-transparent'}`}>
                <div className='flex flex-col gap-1'>
                  <div className='text-sm'>{getVisualTextFromVersionID(sub.version_id)}</div>
                  <div className='text-xs text-muted'>{new Date(sub.subscribed_at).toLocaleDateString()} - {new Date(sub.subscribed_at).toLocaleTimeString()}</div>
                </div>
                <div className={`px-1 py-2 rounded text-xs font-medium ${i > 0 ? '' : 'bg-success text-success-foreground'} ${isOpen ? 'hidden' : ''}`}>{i > 0 ? 'Active' : 'Latest'}</div>
                <div className={`${isOpen ? '' : 'hidden'}`}>
                  <DropdownButton variant='outline' label='⚙️'>
                    <DropdownMenuContent className='w-56' align='start'>
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={async () => {
                          if (isOwner) {
                            // direct to editor.
                            return navigate(
                              `/library/${sub.resource_type}/${sub.version_id}`
                            );
                          }

                          const versionData = await getVersionedResource<any>(sub.version_id)

                          if (!versionData) return

                          // fork
                          return forkItem(item, versionData);
                        }}>
                          {isOwner ? 'Edit' : 'Fork'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => {
                          const versionData = await getVersionedResource(sub.version_id)

                          if (!versionData) return

                          JSONToFile(
                            versionData.reference_type,
                            {
                              item: item,
                              version: versionData,
                            },
                            `${item.name}-${versionData.local_id}`
                          )
                        }}>
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => 
                          openModal('edit-string', ({ id }) => (
                            <EditString
                              id={id} title='Rename Subscription' data={item.name}
                              onSave={(newName) => renameItem(type, item.local_id, newName)} />)
                        )}>
                          Rename
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() =>
                          openModal('delete-subscription', ({ id }) => (
                            <ConfirmModal
                              id={id} title='Delete Subscription' type='danger'
                              message='Are you sure you want to delete this subscription?'
                              onConfirm={() => deleteSubscription(sub.local_id)}
                            />
                          )
                        )}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      {!isOpen && (
        <CardFooter className='flex justify-end gap-2'>
          <Button variant='outline' onClick={async () => {
              const latestVersion = await getVersionedResource<any>(subs[0].version_id)

              if (!latestVersion) return

              if (isOwner) {
                // direct to editor.
                return navigate(
                  `/library/${latestVersion.reference_type}/${latestVersion.local_id}`
                );
              }

              // fork
              return forkItem(item, latestVersion);
            }}>
            {isOwner ? 'Edit' : 'Fork'}
          </Button>
          <DropdownButton variant='outline' label='⚙️'>
            <DropdownMenuContent className='w-56' align='start'>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={async () => {
                  const latestVersion = await getVersionedResource(subs[0].version_id)

                  if (!latestVersion) return

                  JSONToFile(
                    latestVersion.reference_type,
                    {
                      item: item,
                      version: latestVersion,
                    },
                    `${item.name}-${latestVersion.local_id}`
                  )
                }}>
                  Export
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() =>
                  openModal('delete-subscription', ({ id }) => (
                    <ConfirmModal
                      id={id} title='Delete Subscription' type='danger'
                      message='Are you sure you want to delete this subscription?'
                      onConfirm={() => deleteSubscription(subs[0].local_id)}
                    />
                  )
                )}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownButton>
        </CardFooter>
      )}
    </Card>
  )
};

export default SubscriptionCard;