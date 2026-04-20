import { useCallback, useEffect, useState } from 'react'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataType, SystemType } from '@/db/system/schema';
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
import useSubscriptionsWithData, { Grouped } from '@/db/subscription/hooks/useSubscriptionsWithData';

type Props = {
  id: number;
}

const createDefaultPage = (name: string) => ({
  name,
  script: '',
  lexical: '',
  state: [],
})

const CreateSubscriptionModal: React.FC<Props> = ({ id }) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<string>('system')

  const { subscriptions } = useSubscriptionsWithData()

  const [system, setSystem] = useState<Grouped | undefined>()

  useEffect(() => {
    const sys = subscriptions?.find(sub => sub.type === 'system')

    if (!sys) return console.log('no system.')


    if ((sys.local_id === system?.local_id)) return console.log('same version and system')

    setSystem(sys)
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

  
                <Select value={system?.local_id} onValueChange={system_id => {
                  const sys = subscriptions?.find(s => (s.local_id === system_id) && s.type === 'system')
                  if (!sys) return console.log('could not find matching system')
                  setSystem(sys)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select System' />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions?.filter(s => s.type === 'system').map((sys) => (
                      <SelectItem key={sys.local_id} value={sys.local_id}>{sys.item.shadow.name}</SelectItem>
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
                  name,
                  creator: [createDefaultPage('Start')],
                  modals: [createDefaultPage('Start')],
                  pages: [createDefaultPage('Info')],
                  version: '',
                  data: [],
                  defaultCharacterData: {
                    _type: { name: 'CharacterData', properties: [] },
                  },
                  types: [],
                  actions: [],
                }
                break;
              // case 'datapack':
              //   data = {
              //     types: version.data.types,
              //     packData: (version.data as any).data.map((data: DataType) => ({ ...data, data: data.typeData.isArray ? [] : generateObject(version.data.types as SystemType[], (version.data?.types as SystemType[]).find((t: SystemType) => t.name === data.typeData.type)!) }))
              //   }

              //   types = (version.data as any).types.map(generateTypeHash)

              //   break;
            }

            const sub = await createWholeSubscription(type as 'system' | 'datapack', data)

            if (sub && ['datapack', 'system'].includes(type)) {
              storeHashes(sub.local_id, types)
            }
            requestClose()
          }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateSubscriptionModal
