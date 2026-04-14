
import deleteCharacter from '@/db/character/methods/deleteCharacter'
import renameCharacter from '@/db/character/methods/renameCharacter'
import { Character } from '@/db/character/schema'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DropdownButton } from "@/components/ui/dropdown-button"
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

import ConfirmModal from "@/modals/confirm"
import EditString from '@/modals/editors/edit-string'
import { openModal } from "@/state/modals"
import JSONToFile from "@/utils/object/JSONToFile"
import { useNavigate } from "react-router"

import * as automerge from '@automerge/automerge'
import { useMemo } from 'react'
import { Item } from '@/db/shared/schema'

interface Props {
  name: string
  char: Item
}

export default function CharacterCard({ name, char }: Props) {
  const navigate = useNavigate()

  const data: any = useMemo(() => automerge.load(char.doc), [char])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {data._flavor as string}
        </CardDescription>
        <CardAction>
          {/* Status Indicator */}
          <div className={`w-2 h-2 rounded-full shadow-lg bg-warning`} />
        </CardAction>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className='flex gap-2'>
        <Button className='grow' onClick={() => navigate(`/characters/${char.local_id}`)}>
          Continue Adventure
        </Button>
        <DropdownButton variant='outline' label='⚙️'>
          <DropdownMenuContent className='w-56' align='start'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => JSONToFile(char, `${data.name}-export`)}>
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => 
                openModal('edit-string', ({ id }) => (
                  <EditString
                    id={id} title='Rename Character' data={char.shadow.name}
                    onSave={(newName) => renameCharacter(char.local_id, newName)} />)
              )}>
                Rename
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() =>
                openModal('confirm', ({ id }) => (
                  <ConfirmModal
                    id={id} title='Delete Character' type='danger'
                    message='Are you sure you want to delete this character?'
                    onConfirm={() => deleteCharacter(char.local_id)}
                  />
                )
              )}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownButton>
      </CardFooter>
    </Card>
  )
}