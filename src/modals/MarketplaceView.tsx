import { useEffect, useState } from 'react'
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import Checkbox from '../components/inputs/Checkbox';
import Select from '../components/inputs/Select';
import getVisualTextFromVersionID from '../utils/getVisualTextFromVersionID';
import { getVersionsForItem } from '../lib/api';

type Props = {
  data: {
    id: string,
    name: string,
    description: string,
  
    creator_id: string,
    creator_username: string,
  
    version: string,
  
    resource_type: string,
    resource_id: string,
  
    updated_at: string,
    published_at: string
    is_public: boolean
  } | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: string): void;
  onDelete?(): void;
}

type VersionData = { id: string, item_id: string, changelog: string, published_at: string, resource_id: string }

const MarketplaceViewModal: React.FC<Props> = ({ data, title = 'Edit string', isOpen, requestClose, onSave, onDelete } : Props) => {
  const [versions, setVersions] = useState<VersionData[]>([])
  const [autoUpdate, setAutoUpdate] = useState(true)
  
  const [selectedVersion, setSelectedVersion] = useState<VersionData>(versions[0])

  useEffect(() => {
    const loadVersions = async () => {
      if (!data) return setVersions([])

      const newVersions = await getVersionsForItem(data.resource_id)

      setVersions(newVersions)
      setSelectedVersion(newVersions[0])
    }

    loadVersions()
  }, [])

  if (!data) return null

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <h4>{data.description}</h4>
      </ModalBody>

      <ModalFooter>
        <div className='flex items-center justify-between w-full'>
          <Button color='light' onClick={requestClose}>Exit</Button>

          <div className='flex flex-row justify-center gap-2'>
            {(versions.length) ? (
              <>
                <Checkbox id='auto-update' label='Auto Update' checked={autoUpdate} onChange={setAutoUpdate} />

                <Select id='version' containerClassName='flex flex-row items-center gap-2' labelClassName='mb-0' label='Version' value={selectedVersion.item_id} onChange={(val) => setSelectedVersion(versions.find(ver => ver.item_id === val)!)}>
                  {versions.map(ver => (
                    <option value={ver.item_id}>{getVisualTextFromVersionID(ver.item_id)}</option>
                  ))}
                </Select>

                <Button color='primary' onClick={() => onSave(selectedVersion.item_id)}>
                  Subscribe
                </Button>
              </>
            ) : (
              <p>loading versions...</p>
            )}
          </div>
        </div>
      </ModalFooter>
    </Modal>
  )
}

export default MarketplaceViewModal