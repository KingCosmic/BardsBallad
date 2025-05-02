import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';

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
        {/* Check For Available Versions Numbers */}
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' onClick={() => {
          requestClose()
        }}>Confirm</Button>
      </ModalFooter>
    </Modal>
  )
}

export default SaveNewVersion