import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import Select from '@components/inputs/Select';
import { useCallback, useEffect, useState } from 'react';
import { useOurSystems } from '@hooks/useOurSystems';
import Textarea from '@components/inputs/Textarea';
import Checkbox from '@components/inputs/Checkbox';
import { useVersions } from '@hooks/useVersions';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import { VersionedResource } from '@storage/schemas/versionedResource';
import {getMarketplaceItem} from "@api/getMarketplaceItem";
import { closeModal } from '@state/modals';

type Props = {
  id: number;

  onPublish(data: {
    item: any;
    version: VersionedResource;

    description: string
    changelog: string
    
    resource_type: string

    is_public: boolean
  }): void;
}

const PublishNewSystem: React.FC<Props> = ({ id, onPublish }) => {
  const { systems, isLoading: isSystemsLoading } = useOurSystems()
  const { versions, isLoading: isVersionsLoading } = useVersions()

  const [selectedSystem, setSelectedSystem] = useState(systems[0])
  const [selectedVersion, setSelectedVersion] = useState(versions[0])
  
  const [description, setDescription] = useState('')
  const [changelog, setChangelog] = useState('')

  const [isPublic, setIsPublic] = useState(true)
  const [isFirstPublish, setIsFirstPublish] = useState(false)

  useEffect(() => {
    if (!systems) return

    const system = systems[0]

    setSelectedSystem(system)
    setSelectedVersion(versions.find(ver => ver.reference_id === system.local_id)!)
  }, [systems])

  useEffect(() => {
    const getItemData = async () => {
      const item = await getMarketplaceItem(selectedSystem.local_id)
      
      if (!item) return setIsFirstPublish(true)

      setIsFirstPublish(false)
    }

    if (!selectedSystem) return

    getItemData()
  }, [selectedSystem])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Publish New System' onClose={requestClose} />

      <ModalBody>
        <Select id='type-to-publish' label='Item Type' value='system' onChange={val => {}}>
          <option value='system'>System</option>
        </Select>

        <Select id='item-to-publish' label='System' value={selectedSystem?.local_id} onChange={val => setSelectedSystem(systems.find(sys => sys.local_id === val)!)}>
          {systems.map(sys => (
            <option value={sys.local_id}>{sys.name}</option>
          ))}
        </Select>
        
        <Textarea id='description' label='Description' value={description} onChange={setDescription} />

        <Checkbox id='is-public' label='Is public?' checked={isPublic} onChange={setIsPublic} />

        <Select id='version-to-publish' label='Version' value={selectedVersion?.local_id} onChange={val => setSelectedVersion(versions.find(ver => ver.local_id === val)!)}>
          {versions?.filter(vers => vers.reference_id === selectedSystem.local_id).map(vers => (
            <option key={vers.local_id} value={vers.local_id}>{getVisualTextFromVersionID(vers.local_id)}</option>
          ))}
        </Select>
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' onClick={() => {
          onPublish({
            item: selectedSystem,
            version: selectedVersion,
            changelog: changelog,
            description: description,
            resource_type: 'system',
            is_public: isPublic
          })
          requestClose()
        }}>Publish</Button>
      </ModalFooter>
    </Modal>
  )
}

export default PublishNewSystem

