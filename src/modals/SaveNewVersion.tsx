import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import Select from '@components/inputs/Select';

type Props = {
  data: string | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(data: any): void;
}

const SaveNewVersion: React.FC<Props> = ({ data, isOpen, requestClose, onSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Save New Version' onClose={requestClose} />

      <ModalBody>
        <p>All of your changes are saved to a hidden "edits" copy of this version as you make them. This only saves your changes to a new public copy so that characters can use them.</p>
        <p>Are you sure you'd like to save your changes to a new version.</p>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' onClick={() => {
          onSave(true)
          requestClose()
        }}>Confirm</Button>
      </ModalFooter>
    </Modal>
  )
}

export default SaveNewVersion
