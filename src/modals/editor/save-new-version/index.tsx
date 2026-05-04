import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item } from '@/db/shared/schema';
import createSubscription from '@/db/subscription/methods/createSubscription';
import { SystemData } from '@/db/system/schema';
import generateTypeHash from '@/db/typeHashes/methods/generateTypeHash';
import storeHashes from '@/db/typeHashes/methods/storeHashes';
import deleteVersionedResource from '@/db/version/methods/deleteVersionedResource';
import duplicateVersionedResource from '@/db/version/methods/duplicateVersionedResource';
import { closeModal } from '@/state/modals';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import * as automerge from '@automerge/automerge'
import { authState } from '@/state/auth';
import generateUniqueID from '@/utils/db/generateUniqueID';
import { db } from '@/db';

type Props = {
  id: number
  edits: Item
  original: Item
  edits_id: string
  doc: automerge.next.Doc<SystemData>
}

const SaveNewVersion: React.FC<Props> = ({ id, original, edits, edits_id, doc }) => {

  const requestClose = useCallback(() => closeModal(id), [id])
  let navigate = useNavigate();

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Changes</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>All of your changes are saved to a hidden "edits" copy of this item as you make them. This only saves your changes to a new public copy so that characters can use them.</p>
          <p>Are you sure you'd like to save your changes to a new version.</p>
        </DialogBody>
        <DialogFooter>
          <Button color='light' onClick={requestClose}>
            Close
          </Button>

          <Button color='primary' onClick={async () => {
            let newVersion
            // TODO: clean this up? it'll need to be used in all editors, it was derived from duplicateVersionedResource

            try {
              const { user } = authState.get()
          
              const owner_id = (user) ? user.id : 'none'
        
              const local_id = await generateUniqueID()
          
              const versionData: Item = {
                ...edits,
                lifecycle: 'snapshot',
                snapshot: doc,
                doc: undefined,
                owner_id,
                local_id: local_id,
                id: '',
              }
          
              await db.docs.put(versionData);
              newVersion = versionData
            } catch (e) {
              console.log('Error creating versioned resource:', e);
            }
              
            if (!newVersion) return

            const newSub = await createSubscription(newVersion.type, newVersion.local_id)

            if (!newSub) {
              deleteVersionedResource(newVersion.local_id, true)
              return
            }

            storeHashes(newVersion.local_id, doc.types.map(generateTypeHash))

            // I'm not entirely sure how this would happen?
            // possibly a user unsubs from the original but then the ui *shouldn't* allow a user to get into this editing scenario.
            if (!original) {
            } else {
              // reset the edits back inline with the original
              // (to allow for some versioning incase they wanted to make edits off the original again.)
              await duplicateVersionedResource(original, edits_id, true)
            }

            navigate('/library')
            requestClose()
          }}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SaveNewVersion