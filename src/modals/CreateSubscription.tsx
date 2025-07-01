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
import { System, SystemData } from '@storage/schemas/system';
import { VersionedResource } from '@storage/schemas/versionedResource';
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID';
import createWholeSubscription from '@storage/methods/subscriptions/createWholeSubscription';
import generateObject from '@utils/generateObject';

import { sha256 } from 'js-sha256'

type Props = {
  id: number;
  onCreate(newData: any): void;
}

type SystemVersion = Omit<VersionedResource, 'data'> & { data?: SystemData }

const CreateSubscriptionModal: React.FC<Props> = ({ id, onCreate }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<'system' | 'datapack'>('system')
  const [system, setSystem] = useState<System | undefined>()
  const [version, setVersion] = useState<SystemVersion | undefined>()

  const { systems } = useSystems()
  const { versions } = useVersions()

  useEffect(() => {
    const sys = systems[0]

    if (!sys || sys.local_id === system?.local_id) return
    setSystem(sys)

    let vers;

    const filteredVersions = versions.filter(ver => {
      const forSystem = (ver.reference_id === sys.local_id)
      
      return forSystem
    }).sort((a, b) => {
      if (!a || !b) return 0

      const aCreated = new Date(a.created_at)
      const bCreated = new Date(b.created_at)

      return (aCreated > bCreated) ? 1 : 0
    })

    vers = filteredVersions[0]

    if (!vers || vers.local_id === version?.local_id) return

    setVersion(vers)
  }, [systems, versions])

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
            <Select id='basedOff-system' label='System' value={type} onChange={system_id => {
              const sys = systems.find(s => s.local_id === system_id)
              if (!sys) return

              const vers = versions.filter(ver => {
                const forSystem = (ver.reference_id === sys.local_id)
                
                return forSystem
              }).sort((a, b) => {
                const aCreated = new Date(a.created_at)
                const bCreated = new Date(b.created_at)
          
                return (aCreated > bCreated) ? 1 : 0
              })[0]
          
              if (!vers) return
          
              setSystem(sys)
              setVersion(vers)
            }}>
              {systems.map((sys) => <option key={sys.local_id} value={sys.local_id}>{sys.name}</option>)}
            </Select>

            <Select id='basedOff-version' label='Version' value={type} onChange={version_id => {
              const vers = versions.find(v => v.local_id === version_id)
              if (!vers) return

              setVersion(vers)
            }}>
              {versions.map((ver) => <option key={ver.local_id} value={ver.local_id}>{getVisualTextFromVersionID(ver.local_id)}</option>)}
            </Select>
          </>
        ) : null}
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={() => {
          if (!version || !version.data) return console.log('no version data')

          // TODO: make our creation object here based off type.
          // pass off to different save function based off type.
          let data = {}

          switch (type) {
            case 'system':
              data = {}
              break;
            case 'datapack':
              data = {
                types: version.data.types,
                typeHashes: version.data.types.map(typeData => ({ name: typeData.name, hash: sha256(typeData.properties.sort((a, b) => a.key.localeCompare(b.key)).map(type => JSON.stringify(type)).join('/')) })),
                packData: version.data.data.map(data => ({ ...data, data: data.typeData.isArray ? [] : generateObject(version.data!.types, version.data?.types.find(t => t.name === data.typeData.type)!) }))
              }
              break;
          }

          createWholeSubscription(name, type, data)

          onCreate({ name, type })
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default CreateSubscriptionModal
