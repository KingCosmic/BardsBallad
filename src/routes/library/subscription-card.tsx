import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownButton } from "@/components/ui/dropdown-button";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import deleteSubscription from "@/db/subscription/methods/deleteSubscription";
import ConfirmModal from "@/modals/confirm";
import { openModal } from "@/state/modals";
import JSONToFile from "@/utils/object/JSONToFile";
import { useNavigate } from "react-router";
import { Item } from '@/db/shared/schema';

type Props = {
  item: Item;
  subscriptionId: string;
}

const SubscriptionCard: React.FC<Props> = ({ item, subscriptionId }) => {
  const navigate = useNavigate();
  const description = item.shadow.description || item.shadow.summary || item.shadow.subtitle || null;

  const handleOpen = () => navigate(`/library/${item.type}/${item.local_id}`);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{item.shadow.name || 'Unnamed item'}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {description && <p className="text-sm text-muted">{description}</p>}
      </CardContent>

      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" onClick={handleOpen}>
          Open
        </Button>

        <DropdownButton variant="outline" label="⚙️">
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                JSONToFile(item, `${item.shadow.name ?? item.local_id}`);
              }}>
                Export
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() =>
                openModal('delete-subscription', ({ id }) => (
                  <ConfirmModal
                    id={id}
                    title='Delete Subscription'
                    type='danger'
                    message='Are you sure you want to delete this subscription?'
                    onConfirm={() => deleteSubscription(subscriptionId)}
                  />
                ))
              }>
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownButton>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCard;
