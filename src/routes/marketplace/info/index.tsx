import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVersionsForItem } from '@/lib/api/marketplace/getVersionsForItem';
import { MarketplaceItem, MarketplaceVersion } from '@/types/marketplace';
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Header from '@/components/header';
import { getSubscriptionData } from '@/lib/api/marketplace/getSubscriptionData';
import saveSystem from '@/db/system/methods/saveSystem';
import saveVersionedResource from '@/db/version/methods/saveVersionedResource';
import storeHashes from '@/db/typeHashes/methods/storeHashes';
import createSubscription from '@/db/subscription/methods/createSubscription';
import generateTypeHash from '@/db/typeHashes/methods/generateTypeHash';
import { getMarketplaceItemInfo } from '@/lib/api/marketplace/getMarketplaceItemInfo';
import PageContent from '@/components/page-content';

const MarketplaceInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  console.log(id)

  const { isPending: isItemLoading, data } = useQuery<{ item: MarketplaceItem, creator: any, versions: string[] }>({
    queryKey: ['marketplace-item'],
    queryFn: () => getMarketplaceItemInfo(id ?? ''),
  })

  const { item, creator, versions: versionIds } = data ?? { item: undefined, user: undefined, versions: [] }

  const { isPending: isVersionsLoading, data: versions } = useQuery<MarketplaceVersion[]>({
    queryKey: ['marketplace-versions', item?.resource_id],
    queryFn: () => getVersionsForItem(item?.resource_id ?? ''),
    initialData: [],
    enabled: !!item?.resource_id
  });
  
  const [selectedVersion, setSelectedVersion] = useState<string>(versionIds[0] ?? '');

  useEffect(() => {
    setSelectedVersion(versionIds[0] ?? '')
  }, [versionIds])

  const handleGet = async () => {
    try {
      const { baseData, versionData } = await getSubscriptionData(selectedVersion)

      if (!baseData || !versionData) {
        console.log('no data??')
        return
      }

      const sys = await saveSystem(baseData)

      if (!sys) {
        console.log('no sys??')
        return
      }

      const vers = await saveVersionedResource(versionData)

      if (!vers) {
        // TODO: clean up system that we created.
        console.log('no vers??')
        return
      }

      const hashes = await storeHashes(vers.local_id, (vers.data as any).types.map(generateTypeHash))
      
      if (!hashes) {
        // TODO: cleanup the system and version.
        console.log('no hashes??')
        return
      }

      const sub = await createSubscription('system', sys.local_id, vers.local_id, false)

      if (!sub) {
        // TODO: cleanup both the system and version and hashes we created.
        console.log('no sub??')
        return
      }

      navigate('/library')
    } catch(e) {
      console.error(`Error creating subscription: ${e}`)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header 
        title={item?.name ?? 'Loading...'}
        subtitle={`By ${creator?.username}`}
      />
      
      <PageContent>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Description Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {item?.description}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="mt-1 capitalize">{item?.resource_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Creator</dt>
                <dd className="mt-1">{creator?.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current Version</dt>
                <dd className="mt-1">{getVisualTextFromVersionID(versionIds[0] ?? '')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">{item?.is_public ? 'Public' : 'Private'}</dd>
              </div>
            </dl>
          </div>

          {/* Download Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Get this {item?.resource_type}</h2>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Version
                </label>
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger>
                    <SelectValue placeholder={isVersionsLoading ? 'Loading versions...' : 'Select Version'} />
                  </SelectTrigger>
                  <SelectContent>
                    {versions.map(v => (
                      <SelectItem key={v.item_id} value={v.item_id}>
                        {getVisualTextFromVersionID(v.item_id)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGet} disabled={!selectedVersion || isVersionsLoading}>
                Get
              </Button>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-start">
            <Button variant="outline" onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default MarketplaceInfo;
