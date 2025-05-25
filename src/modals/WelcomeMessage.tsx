import Button from '@components/inputs/Button';
import Modal from '@components/Modal';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import ModalHeader from '@components/Modal/Header';

type Props = {
  data: string | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: boolean): void;
  onDelete?(): void;
}

const WelcomeMessage: React.FC<Props> = ({ data, title = 'Edit string', isOpen, requestClose, onSave, onDelete }) => {
  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title}onClose={requestClose} />

      <ModalBody>
        <div className='flex flex-col gap-2'>
          <p>Welcome to BardsBallad we're a System Agnostic TTRPG Character Manager</p>
          <p>Seems you're new here. Would you like to take a tour?</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color='light'
          onClick={() => {
            onDelete!()
            requestClose()
          }}
        >
          No Thank You
        </Button>

        <Button color='primary' onClick={() => {
          onSave(false)
          requestClose()
        }}>Yes Please!</Button>
      </ModalFooter>
    </Modal>
  )
}

export default WelcomeMessage
