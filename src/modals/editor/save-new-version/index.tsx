import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import createSubscription from '@/db/subscription/methods/createSubscription';
import generateTypeHash from '@/db/typeHashes/methods/generateTypeHash';
import storeHashes from '@/db/typeHashes/methods/storeHashes';
import deleteVersionedResource from '@/db/version/methods/deleteVersionedResource';
import duplicateVersionedResource from '@/db/version/methods/duplicateVersionedResource';
import { VersionedResource } from '@/db/version/schema';
import { closeModal } from '@/state/modals';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

type Props = {
  id: number;
  edits: VersionedResource
  original: VersionedResource
  edits_id: string
}

const SaveNewVersion: React.FC<Props> = ({ id, original, edits, edits_id }) => {

  const requestClose = useCallback(() => closeModal(id), [id])
  let navigate = useNavigate();

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save New Version</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>All of your changes are saved to a hidden "edits" copy of this version as you make them. This only saves your changes to a new public copy so that characters can use them.</p>
          <p>Are you sure you'd like to save your changes to a new version.</p>
        </DialogBody>
        <DialogFooter>
          <Button color='light' onClick={requestClose}>
            Close
          </Button>

          <Button color='primary' onClick={async () => {
            const newVersion = await duplicateVersionedResource(edits)
              
            if (!newVersion) return

            const newSub = await createSubscription(newVersion.reference_type, newVersion.reference_id, newVersion.local_id, false)

            if (!newSub) {
              deleteVersionedResource(newVersion.local_id, true)
              return
            }

            storeHashes(newVersion.local_id, (newVersion.data as any).types.map(generateTypeHash))

            // I'm not entirely sure how this would happen?
            // possibly a user unsubs from the original but then the ui *shouldn't* allow a user to get into this editing scenario.
            if (!original) {
            } else {
              // reset the edits back inline with the original
              // (to allow for some versioning incase they wanted to make edits off this version again.)
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