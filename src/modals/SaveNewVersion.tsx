import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import { useCallback } from 'react';
import { closeModal } from '@state/modals';
import duplicateVersionedResource from '@storage/methods/versionedresources/duplicateVersionedResource';
import { addToast } from '@state/toasts';
import createSubscription from '@storage/methods/subscriptions/createSubscription';
import { VersionedResource } from '@storage/schemas/versionedResource';
import { useNavigate } from 'react-router';
import deleteVersionedResource from '@storage/methods/versionedresources/deleteVersionedResource';

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
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Save New Version' onClose={requestClose} />

      <ModalBody>
        <p>All of your changes are saved to a hidden "edits" copy of this version as you make them. This only saves your changes to a new public copy so that characters can use them.</p>
        <p>Are you sure you'd like to save your changes to a new version.</p>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' onClick={async () => {
          const newVersion = await duplicateVersionedResource(edits)
            
          if (!newVersion) return addToast(`Error creating new version from edits`, 'error')

          const newSub = await createSubscription(newVersion.reference_type, newVersion.reference_id, newVersion.local_id, false)

          if (!newSub) {
            deleteVersionedResource(newVersion.local_id, true)
            return addToast(`Error creating subscription to new version, cleaning up...`, 'error')
          }

          // I'm not entirely sure how this would happen?
          // possibly a user unsubs from the original but then the ui *shouldn't* allow a user to get into this editing scenario.
          if (!original) {
            addToast(`Error finding original??? Please open a ticket for this :).`, 'error')
          } else {
            // reset the edits back inline with the original
            // (to allow for some versioning incase they wanted to make edits off this version again.)
            await duplicateVersionedResource(original, edits_id, true)
          }

          // TODO: Make this confirmation part of the modal. no reason to open toast in the corner. bad ux for bigger devices.
          addToast('Success Creating ')

          navigate('/library')
          requestClose()
        }}>Confirm</Button>
      </ModalFooter>
    </Modal>
  )
}

export default SaveNewVersion
