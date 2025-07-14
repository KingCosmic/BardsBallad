import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import TextInput from '@components/inputs/TextInput';
import Select from '@components/inputs/Select';

import { closeModal } from '@state/modals'
import { useSystems } from '@hooks/useSystems';
import { useVersions } from '@hooks/useVersions';
import { SystemData } from '@storage/schemas/system';
import { VersionedResource } from '@storage/schemas/versionedResource';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import createWholeSubscription from '@storage/methods/subscriptions/createWholeSubscription';
import generateObject from '@utils/generateObject';

import { sha256 } from 'js-sha256'
import { Item } from '@storage/index';
import storeHashes from '@storage/methods/hashes/storeHashes';
import useSubscriptionsWithData, { Grouped } from '@hooks/useSubscriptionsWithData';
import generateTypeHash from '@utils/generateTypeHash';

type Props = {
  id: number;
  onCreate(newData: any): void;
}

type SystemVersion = Omit<VersionedResource, 'data'> & { data?: SystemData }

const CreateSubscriptionModal: React.FC<Props> = ({ id, onCreate }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<'system' | 'datapack'>('system')

  const { subscriptions, isLoading } = useSubscriptionsWithData()

  const [system, setSystem] = useState<Grouped | undefined>()
  const [version, setVersion] = useState<SystemVersion | undefined>()

  useEffect(() => {
    const sys = subscriptions?.find(sub => sub.type === 'system')

    if (!sys) return console.log('no system.')

    let version = sys.versions[0]

    if (!version) return console.log('no version.')

    if ((sys.item_id === system?.item_id) && (version.local_id === version?.local_id)) return console.log('same version and system')

    setSystem(sys)
    setVersion(version)
  }, [subscriptions])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Create Subscription' onClose={requestClose} />

      <ModalBody>
        <TextInput id='name' label='Name' placeholder='baba yaga' value={name} onChange={setName} isValid errorMessage='' />

        <Select id='susbcription-type' label='Type' value={type} onChange={value => {
          // @ts-expect-error
          setType(value)
        }}>
          <option value='system'>System</option>
          <option value='datapack'>Data Pack</option>
          <option value='theme' disabled>Theme</option>
        </Select>

        {(type === 'datapack') ? (
          <>
            <Select id='basedOff-system' label='System' value={system?.item_id || ''} onChange={system_id => {
              const sys = subscriptions?.find(s => (s.item_id === system_id) && s.type === 'system')
              if (!sys) return console.log('could not find matching system')
              setSystem(sys)

              const vers = sys.versions[0]
          
              if (!vers) return

              setVersion(vers)
            }}>
              {subscriptions?.filter(s => s.type === 'system').map((sys) => <option key={sys.item_id} value={sys.item_id}>{sys.item.name}</option>)}
            </Select>

            <Select id='basedOff-version' label='Version' value={version?.local_id || ''} onChange={version_id => {
              const vers = system?.versions.find(v => v.local_id === version_id)
              if (!vers) return console.log('could not find matching version')

              setVersion(vers)
            }}>
              {system?.versions.map((ver) => <option key={ver.local_id} value={ver.local_id}>{getVisualTextFromVersionID(ver.local_id)}</option>)}
            </Select>
          </>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={async () => {
          let data = {}
          let types: { name: string, hash: string }[] = []

          switch (type) {
            case 'system':
              // TODO: fix this with the new implementation.
              data = {}
              break;
            case 'datapack':
              if (!version || !version.data) return console.log('no version data')
        
              data = {
                types: version.data.types,
                packData: version.data.data.map(data => ({ ...data, data: data.typeData.isArray ? [] : generateObject(version.data!.types, version.data?.types.find(t => t.name === data.typeData.type)!) }))
              }

              types = version!.data!.types.map(generateTypeHash)

              break;
          }

          const sub = await createWholeSubscription(name, type, data)

          if (sub && ['datapack', 'system'].includes(type)) {
            storeHashes(sub.version_id, types)
          }

          onCreate({ name, type })
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateSubscriptionModal
