import { Subscription } from "@/db/subscription/schema"
import { useLiveQuery } from "dexie-react-hooks"
import getItem from "@/db/shared/methods/getItem"
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID"
import reviveSubscription from "@/db/subscription/methods/reviveSubscription"
import { DropdownButton } from "@/components/ui/dropdown-button"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import clearSubscription from "@/db/subscription/methods/clearSubscription"
import { openModal } from "@/state/modals"
import JSONToFile from "@/utils/object/JSONToFile"
import ConfirmModal from "@/modals/confirm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default ({ sub }: { sub: Subscription }) => {
  const item = useLiveQuery(() => getItem(sub.resource_type, sub.resource_id), [sub])

  if (!item) return <p>loading</p>

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>
          {sub.resource_type} | {getVisualTextFromVersionID(sub.version_id)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Button className='grow' onClick={() => reviveSubscription(sub.local_id)}>
          Revive {sub.resource_type}
        </Button>
        <DropdownButton variant='outline' label='⚙️'>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => JSONToFile(sub.resource_type, item, `${item.name}-export`)}>
                Export
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                openModal('confirm', ({ id }) => (
                  <ConfirmModal
                    id={id} title={`Force Delete ${sub.resource_type}`}
                    type='danger'
                    message={`Are you sure you want to force delete this ${sub.resource_type}?`}
                    onConfirm={() => clearSubscription(sub.local_id)} />
                ))
              }}>
                Force Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownButton>
      </CardFooter>
    </Card>
  )
}