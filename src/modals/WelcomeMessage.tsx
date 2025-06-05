import Button from '@components/inputs/Button';
import Modal from '@components/Modal';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import ModalHeader from '@components/Modal/Header';

type Props = {
  no(): void;
  yes(): void;
}

const WelcomeMessage: React.FC<Props> = ({ yes, no }) => {
  return (
    <Modal isOpen onClose={no}>
      <ModalHeader title='Welcome Adventurer' onClose={no} />

      <ModalBody>
        <div className='flex flex-col gap-2'>
          <p>Welcome to BardsBallad we're a System Agnostic TTRPG Character Manager</p>
          <p>Seems you're new here. Would you like to take a tour?</p>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={no}>
          No Thank You
        </Button>

        <Button color='primary' onClick={yes}>
          Yes Please!
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default WelcomeMessage
