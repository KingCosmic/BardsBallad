import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Checkbox from '@components/inputs/Checkbox';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import DropdownButton from '@components/DropdownButton';
import {getVersionsForItem} from "@api/getVersionsForItem";
import { closeModal } from '@state/modals';

type Props = {
  id: number;
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

  onSubscribe(version_id: string): void;
}

type VersionData = { id: string, item_id: string, changelog: string, published_at: string, resource_id: string }

const MarketplaceViewModal: React.FC<Props> = ({ id, data, title = 'Item Name', onSubscribe } : Props) => {
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

  const requestClose = useCallback(() => closeModal(id), [id])

  if (!data) return null

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <h4>{data.description}</h4>
      </ModalBody>

      <ModalFooter>
        <div className='flex items-center justify-between w-full'>
          <div className='flex flex-row justify-center gap-2'>
            {(versions.length) ? (
              <>
                <Checkbox id='auto-update' label='Auto Update' checked={autoUpdate} onChange={setAutoUpdate} />
                
                <DropdownButton label={getVisualTextFromVersionID(selectedVersion.item_id)} onClick={() => {
                  requestClose()
                  onSubscribe(selectedVersion.item_id)
                }}
                  options={versions.map(ver => ({
                    label: getVisualTextFromVersionID(ver.item_id),
                    onClick: () => setSelectedVersion(ver)
                  }))}
                />
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

