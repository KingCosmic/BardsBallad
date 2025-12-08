import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVersionsForItem } from '@/lib/api/marketplace/getVersionsForItem';
import { closeModal } from '@/state/modals';
import { MarketplaceVersion } from '@/types/marketplace';
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

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
  };
}

const MarketplaceViewModal: React.FC<Props> = ({ id, data } : Props) => {
  const { isPending, data: versions } = useQuery<MarketplaceVersion[]>({
    queryKey: ['marketplace-versions'],
    queryFn: () => getVersionsForItem(data.resource_id),
    initialData: []
  })
  
  const [selectedVersion, setSelectedVersion] = useState<string>(versions[0]?.item_id)

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Dialog open onOpenChange={requestClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get System</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <h4 className='text-fantasy-accent font-medium text-2xl'>{data.name}</h4>
          <p>
            {data.description}
          </p>
        </div>
        <DialogFooter>
          <Select value={selectedVersion} onValueChange={setSelectedVersion}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={isPending ? 'Loading versions...' : 'Select Version' }/>
            </SelectTrigger>
            <SelectContent>
              {versions.map(v => (
                <SelectItem value={v.item_id}>
                  {getVisualTextFromVersionID(v.item_id)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={requestClose}>
            Get
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MarketplaceViewModal