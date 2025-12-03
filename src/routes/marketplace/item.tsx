import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MarketplaceViewModal from "@/modals/marketplace/view-item";
import { openModal } from "@/state/modals";
import { MarketplaceItem } from "@/types/marketplace";
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID";
import { IconDownload, IconHeart } from "@tabler/icons-react";

const ItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          {item.creator_username}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Version {getVisualTextFromVersionID(item.version)}</p>
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Button className='grow' onClick={() =>
        openModal('view marketplace item', ({ id }) => (
          <MarketplaceViewModal id={id} data={item} />
        )
      )}>
          <IconDownload /> Get
        </Button>
        <Button variant='ghost' size='icon'>
          <IconHeart />
        </Button>
      </CardFooter>
    </Card>
  )
};

export default ItemCard