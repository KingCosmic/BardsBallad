import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import Select from '@components/inputs/Select';
import { useEffect, useState } from 'react';
import { useVersions } from '@hooks/useVersions';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import { useOurSystems } from '@hooks/useOurSystems';
import TextInput from '@components/inputs/TextInput';

type Props = {
  data: string | null;

  isOpen: boolean;
  requestClose(): void;
  onSave(data: any): void;
}

const PublishNewVersion: React.FC<Props> = ({ data, isOpen, requestClose, onSave }) => {
  const { systems, isLoading: isSystemsLoading } = useOurSystems()

  const [selectedSystem, setSelectedSystem] = useState(systems[0])

  const { versions, isLoading: isVersionsLoading } = useVersions()

  const [selectedVersion, setSelectedVersion] = useState(versions[0])

  const [changelog, setChangelog] = useState('')

  console.log(systems)

  useEffect(() => {
    if (!systems) return

    const system = systems[0]

    setSelectedSystem(system)
    setSelectedVersion(versions.find(ver => ver.reference_id === system.local_id)!)
  }, [systems])

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title='Publish New Version' onClose={requestClose} />

      <ModalBody>
        <Select id='system-to-publish' label='System' value={selectedSystem?.local_id} onChange={val => setSelectedSystem(systems.find(sys => sys.local_id === val)!)}>
          {systems.map(sys => (
            <option key={sys.local_id} value={sys.local_id}>{sys.name}</option>
          ))}
        </Select>

        <Select id='version-to-publish' label='Version' value={selectedVersion?.local_id} onChange={val => setSelectedVersion(versions.find(ver => ver.local_id === val)!)}>
          {versions?.filter(vers => vers.reference_id === selectedSystem.local_id).map(vers => (
            <option key={vers.local_id} value={vers.local_id}>{getVisualTextFromVersionID(vers.local_id)}</option>
          ))}
        </Select>

        <TextInput id='changelog' label='Changelog' value={changelog} onChange={setChangelog} isValid={true} errorMessage='' />
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' disabled={(!selectedSystem && !selectedVersion)} onClick={() => {
          onSave({
            version_id: selectedVersion.local_id,
            system_id: selectedSystem.local_id,
            changelog
          })
          requestClose()
        }}>Confirm</Button>
      </ModalFooter>
    </Modal>
  )
}

export default PublishNewVersion
