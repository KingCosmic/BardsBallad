import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import useSubscriptionsWithData from '@/hooks/subscriptions/useSubscriptionsWithData';
import { getMarketplaceItem } from '@/lib/api/marketplace/getMarketplaceItem';
import { publishItem } from '@/lib/api/marketplace/publishItem';
import { publishVersion } from '@/lib/api/marketplace/publishVersion';
import { closeModal } from '@/state/modals';
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID';
import { useCallback, useEffect, useState } from 'react';

type Props = {
  id: number;
}

const PublishItem: React.FC<Props> = ({ id }) => {
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
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isFirstPublish ? 'Publish new Item' : 'Publish new version'}
          </DialogTitle>
          <DialogDescription>
            Another realm of the multiverse
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='min-h-0 max-h-[60dvh]'>
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
            <div className='flex flex-col gap-4'>
              <Field>
                <Label>Item Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='system'>System</SelectItem>
                    <SelectItem value='datapack'>Datapack</SelectItem>
                    <SelectItem value='theme'>Theme</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>{type.toUpperCase()}</Label>
                <Select value={selectedItem?.item_id} onValueChange={val => setSelectedItem(subscriptions.find(sys => sys.item_id === val)!)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Item' />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.filter(sub => sub.type === type).map(sys => (
                      <SelectItem key={sys.item_id} value={sys.item_id}>
                        {sys.item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <Label>{isFirstPublish ? 'Description' : 'Changelog'}</Label>
                <Textarea value={description} onChange={v => setDescription(v.currentTarget.value)} />
              </Field>

              {isFirstPublish && (
                <Field orientation='horizontal'>
                  <Checkbox checked={isPublic} onCheckedChange={v => setIsPublic(v.valueOf() as boolean)} />
                  <Label>Is Public?</Label>
                </Field>
              )}

              <Field>
                <Label>Version</Label>
                <Select value={selectedVersion?.local_id} onValueChange={val => setSelectedVersion(selectedItem.versions.find(ver => ver.local_id === val)!)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select Version' />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedItem.versions.map(vers => (
                      <SelectItem key={vers.local_id} value={vers.local_id}>
                        {getVisualTextFromVersionID(vers.local_id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant='outline' onClick={requestClose}>
            Cancel
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PublishItem