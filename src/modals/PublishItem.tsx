import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import Select from '@components/inputs/Select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOurSystems } from '@hooks/useOurSystems';
import Textarea from '@components/inputs/Textarea';
import Checkbox from '@components/inputs/Checkbox';
import { useVersions } from '@hooks/useVersions';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import { VersionedResource } from '@storage/schemas/versionedResource';
import {getMarketplaceItem} from "@api/getMarketplaceItem";
import { closeModal } from '@state/modals';
import { useSubscriptions } from '@hooks/useSubscriptions';
import useSubscriptionsWithData from '@hooks/useSubscriptionsWithData';

import { publishItem } from '@api/marketplace/publishItem';
import { publishVersion } from '@api/marketplace/publishVersion';

type Props = {
  id: number;
}

const PublishNewSystem: React.FC<Props> = ({ id }) => {
  const { subscriptions, isLoading } = useSubscriptionsWithData()

  const [type, setType] = useState<string>('system')

  const [selectedItem, setSelectedItem] = useState(subscriptions?.find(sub => sub.type === 'system'))
  const [selectedVersion, setSelectedVersion] = useState(selectedItem?.versions[0])
  
  const [description, setDescription] = useState('')

  const [isPublic, setIsPublic] = useState(true)
  const [isFirstPublish, setIsFirstPublish] = useState(true)

  const [{ isPublishing, error }, setPublishing] = useState({ isPublishing: false, error: '' })

  useEffect(() => {
    if (!subscriptions) return

    const item = subscriptions?.find(sub => sub.type === type)

    setSelectedItem(item)
    setSelectedVersion(item?.versions[0])
  }, [subscriptions, type])

  useEffect(() => {
    const getItemData = async () => {
      if (!selectedItem) return

      const item = await getMarketplaceItem(selectedItem?.item_id)
      
      if (!item) return setIsFirstPublish(true)

      setIsFirstPublish(false)
    }

    getItemData()
  }, [selectedItem])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title={isFirstPublish ? 'Publish new Item' : 'Publish new version'} onClose={requestClose} />

      <ModalBody>
        {(isLoading || !subscriptions || !selectedItem || !selectedVersion) ? (
          <p>Loading...</p>
        ) : (isPublishing || error) ? (
          <div>
            {isPublishing ? (
              <p>Publishing...</p>
            ) : (
              <p>{error}</p>
            )}
          </div>
        ) : (
          <>
            <Select id='type-to-publish' label='Item Type' value={type} onChange={setType}>
              <option value='system'>System</option>
              <option value='datapack'>Datapack</option>
            </Select>

            <Select id='item-to-publish' label='System' value={selectedItem?.item_id} onChange={val => setSelectedItem(subscriptions.find(sys => sys.item_id === val)!)}>
              {subscriptions.filter(sub => sub.type === type).map(sys => <option key={sys.item_id} value={sys.item_id}>{sys.item.name}</option>)}
            </Select>
            
            <Textarea id='description' label={isFirstPublish ? 'Description' : 'Changelog' } value={description} onChange={setDescription} />

            {isFirstPublish && (
              <Checkbox id='is-public' label='Is public?' checked={isPublic} onChange={setIsPublic} />
            )}

            <Select id='version-to-publish' label='Version' value={selectedVersion?.local_id} onChange={val => setSelectedVersion(selectedItem.versions.find(ver => ver.local_id === val)!)}>
              {selectedItem.versions.map(vers => (
                <option key={vers.local_id} value={vers.local_id}>{getVisualTextFromVersionID(vers.local_id)}</option>
              ))}
            </Select>
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>
          Close
        </Button>

        <Button color='primary' disabled={(!selectedItem || !selectedVersion)} onClick={async () => {
          setPublishing({ isPublishing: true, error: '' })

          let err = ''

          switch (isFirstPublish) {
            case true:
              const { error: publishError } = await publishItem({
                item: selectedItem!.item,
                version: selectedVersion!,
                description: description,
                resource_type: type,
                is_public: isPublic
              })

              if (publishError) err = publishError
              break;
            case false:
              const { error: versionError } = await publishVersion(selectedItem!.item_id, {
                item_id: selectedItem!.item_id,
                version: selectedVersion!,
                changelog: description
              })

              if (versionError) err = versionError
              break;
          }

          if (err) setPublishing({ isPublishing: false, error: err })

          requestClose()
        }}>Publish</Button>
      </ModalFooter>
    </Modal>
  )
}

export default PublishNewSystem

