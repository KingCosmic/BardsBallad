import { useCallback, useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataType, SystemType } from '@/db/system/schema';
import { VersionedResource } from '@/db/version/schema';
import useSubscriptionsWithData, { Grouped } from '@/hooks/subscriptions/useSubscriptionsWithData';
import { closeModal } from '@/state/modals';
import { Button } from '@/components/ui/button';
import createWholeSubscription from '@/db/subscription/methods/createWholeSubscription';
import storeHashes from '@/db/typeHashes/methods/storeHashes';
import generateTypeHash from '@/db/typeHashes/methods/generateTypeHash';
import generateObject from '@/utils/object/generateObject';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID';

type Props = {
  id: number;
}

const CreateSubscriptionModal: React.FC<Props> = ({ id }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('system')

  const { subscriptions } = useSubscriptionsWithData()

  const [system, setSystem] = useState<Grouped | undefined>()
  const [version, setVersion] = useState<VersionedResource | undefined>()

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
    <Dialog open onOpenChange={requestClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Subscription</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <Field>
            <Label>Name</Label>
            <Input placeholder='baba yaga' value={name} onChange={v => setName(v.currentTarget.value)} />
          </Field>

          <Field>
            <Label>Type</Label>

            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder='Select Type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='system'>System</SelectItem>
                <SelectItem value='datapack'>Data Pack</SelectItem>
                <SelectItem value='theme'>Theme</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {(type === 'datapack') ? (
            <>
              <Field>
                <Label>System</Label>

                <Select value={system?.item_id} onValueChange={system_id => {
                  const sys = subscriptions?.find(s => (s.item_id === system_id) && s.type === 'system')
                  if (!sys) return console.log('could not find matching system')
                  setSystem(sys)

                  const vers = sys.versions[0]
              
                  if (!vers) return

                  setVersion(vers)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select System' />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions?.filter(s => s.type === 'system').map((sys) => (
                      <SelectItem key={sys.item_id} value={sys.item_id}>{sys.item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>Version</Label>

                <Select value={version?.local_id} onValueChange={version_id => {
                  const vers = system?.versions.find(v => v.local_id === version_id)
                  if (!vers) return console.log('could not find matching version')

                  setVersion(vers)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Version' />
                  </SelectTrigger>
                  <SelectContent>
                    {system?.versions.map((ver) => (
                      <SelectItem key={ver.local_id} value={ver.local_id}>
                        {getVisualTextFromVersionID(ver.local_id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </>
          ) : null}
        </div>
        <DialogFooter>
          <Button onClick={async () => {
            let data = {}
            let types: { name: string, hash: string }[] = []

            switch (type) {
              case 'system':
                data = {
                  creator: [],
                  modals: [],
                  pages: [],
                  version: '',
                  data: [],
                  defaultCharacterData: {
                    _type: { name: 'CharacterData', properties: [] },
                  },
                  types: [],
                  actions: [],
                }
                break;
              case 'datapack':
                if (!version || !version.data) return console.log('no version data')
          
                data = {
                  types: version.data.types,
                  packData: (version.data as any).data.map((data: DataType) => ({ ...data, data: data.typeData.isArray ? [] : generateObject(version.data.types as SystemType[], (version.data?.types as SystemType[]).find((t: SystemType) => t.name === data.typeData.type)!) }))
                }

                types = (version.data as any).types.map(generateTypeHash)

                break;
            }

            const sub = await createWholeSubscription(name, type as 'system' | 'datapack', data)

            if (sub && ['datapack', 'system'].includes(type)) {
              storeHashes(sub.version_id, types)
            }
            requestClose()
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSubscriptionModal
