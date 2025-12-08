import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import { openModal } from "@/state/modals"
import CharacterCreator from "@/modals/creation/character-creator"

export default function NoCharacters() {
  return (
    <Empty className='absolute top-0 left-0 bottom-0 right-0'>
      <EmptyHeader>
        <EmptyTitle>No Adventurers</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any Adventurers yet. Get started by creating
          your first Adventurer.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button onClick={() => openModal('create-adv', CharacterCreator)}>Create Adventurer</Button>
          <Button variant="outline">Import Adventurer</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
