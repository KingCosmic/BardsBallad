import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getVersionsForItem } from '@/lib/api/marketplace/getVersionsForItem';
import { MarketplaceVersion } from '@/types/marketplace';
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import Header from '@/components/header';

const MarketplaceInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // TODO: Fetch the marketplace item data using the id
  // For now, using placeholder data
  const data = {
    id: id || '',
    name: 'System Name',
    description: 'System description goes here...',
    creator_id: '',
    creator_username: 'Creator',
    version: '1.0.0',
    resource_type: 'system',
    resource_id: id || '',
    updated_at: '',
    published_at: '',
    is_public: true
  };

  const { isPending, data: versions } = useQuery<MarketplaceVersion[]>({
    queryKey: ['marketplace-versions', data.resource_id],
    queryFn: () => getVersionsForItem(data.resource_id),
    initialData: [],
    enabled: !!data.resource_id
  });
  
  const [selectedVersion, setSelectedVersion] = useState<string>(versions[0]?.item_id);

  const handleGet = () => {
    // TODO: Implement the get/download functionality
    console.log('Getting version:', selectedVersion);
  };

  return (
    <div className="flex flex-col h-full">
      <Header 
        title={data.name}
        subtitle={`By ${data.creator_username}`}
      />
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Description Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {data.description}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="mt-1 capitalize">{data.resource_type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Creator</dt>
                <dd className="mt-1">{data.creator_username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Current Version</dt>
                <dd className="mt-1">{data.version}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                <dd className="mt-1">{data.is_public ? 'Public' : 'Private'}</dd>
              </div>
            </dl>
          </div>

          {/* Download Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Get this {data.resource_type}</h2>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Select Version
                </label>
                <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                  <SelectTrigger>
                    <SelectValue placeholder={isPending ? 'Loading versions...' : 'Select Version'} />
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
              <Button onClick={handleGet} disabled={!selectedVersion || isPending}>
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
      </div>
    </div>
  );
};

export default MarketplaceInfo;
