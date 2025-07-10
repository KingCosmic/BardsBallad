import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Checkbox from '@components/inputs/Checkbox';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import {getVersionsForItem} from "@api/getVersionsForItem";
import { closeModal } from '@state/modals';
import ButtonWithDropdown from '@components/ButtonWithDropdown';
import Button from '@components/inputs/Button';
import DropdownButton from '@components/DropdownButton';

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
      <ModalHeader title='Install System' onClose={requestClose} />

      <ModalBody>
        {/* Title and Version */}
        <div className='text-center'>
          <h4 className='text-fantasy-accent font-medium text-2xl'>{data.name}</h4>
          <p className='text-sm text-fantasy-text-muted mt-1'>Compatible with 0.0.1</p>
        </div>
        <div className='p-6 text-center fantasy-card-gradient text-fantasy-text border border-white/10 rounded-lg transition-all duration-300 hover:bg-white/20'>
          <p>{data.description}</p>
          <div className='flex flex-wrap gap-3 justify-center mt-2'>
            <span className='bg-gradient-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>✨ Advanced Character Sheets</span>
            <span className='bg-gradient-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>🎲 Automated Dice Rolling</span>
            <span className='bg-gradient-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>📚 Spell Compendium</span>
            <span className='bg-gradient-to-br from-fantasy-accent/20 to-fantasy-accent-dark/10 border border-fantasy-accent/30 rounded-xl px-4 py-2 text-sm leading-relaxed'>⚔️ Combat Tracker</span>
          </div>
        </div>

        <div>
          <h4 className='text-lg'>Supported Datapacks</h4>
          <div className='flex gap-6 overflow-x-auto py-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
              <div className='fantasy-card-gradient border border-fantasy-border rounded-2xl p-6 cursor-pointer transition-all duration-500 backdrop-blur-lg shadow-2xl hover:-translate-y-2 hover:shadow-fantasy-accent/20 hover:shadow-xl hover:border-fantasy-accent/40 relative'>
                {/* Header */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-brand-600 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-fantasy-text">
                        {/* {itemData.name[0]} */}
                        T
                      </span>
                      </div>
                    <div className='w-32'>
                      <div className='text-lg font-semibold text-fantasy-text'>Test Pack</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex items-center justify-center w-full'>
          <div className='flex flex-row justify-center gap-2'>
            {(versions.length) ? (
              <>
                <Checkbox id='auto-update' label='Auto Update' checked={autoUpdate} onChange={setAutoUpdate} />
                
                <DropdownButton label={getVisualTextFromVersionID(selectedVersion.item_id)}
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
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>Cancel</Button>

        <Button color='primary' onClick={() => {
          requestClose()
          onSubscribe(selectedVersion.item_id)
        }}>Install</Button>
      </ModalFooter>
    </Modal>
  )
}

export default MarketplaceViewModal

