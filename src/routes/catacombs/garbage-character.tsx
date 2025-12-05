import { DropdownButton } from "@/components/ui/dropdown-button"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { openModal } from "@/state/modals"
import JSONToFile from "@/utils/object/JSONToFile"
import ConfirmModal from "@/modals/confirm"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Character } from "@/db/character/schema"
import reviveCharacter from "@/db/character/methods/reviveCharacter"
import clearCharacter from "@/db/character/methods/clearCharacter"



export default ({ char }: { char: Character }) => {

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{char.name}</CardTitle>
        <CardDescription>
          {char.data._flavor as string}
        </CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Button className='grow' onClick={() => reviveCharacter(char.local_id)}>
          Revive Adventurer
        </Button>
        <DropdownButton variant='outline' label='⚙️'>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => JSONToFile('character', char, `${char.name}-export`)}>
                Export
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {
                openModal('confirm', ({ id }) => <ConfirmModal id={id} title='Force Delete Character' type='danger' message='Are you sure you want to force delete this character?' onConfirm={() => clearCharacter(char.local_id)} />)
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