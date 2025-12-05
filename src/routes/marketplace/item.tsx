import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceItem } from "@/types/marketplace";
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID";
import { IconDownload, IconHeart } from "@tabler/icons-react";
import { useNavigate } from "react-router";

const ItemCard: React.FC<{ item: MarketplaceItem }> = ({ item }) => {
  const navigate = useNavigate();

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
        <Button 
          className='grow' 
          onClick={() => navigate(`/marketplace/info/${item.id}`)}
        >
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