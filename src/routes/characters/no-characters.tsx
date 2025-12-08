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
import ImportFile from '@/modals/import-file'
import importCharacter from '@/db/character/methods/importCharacter'

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
          <Button variant="outline" onClick={() => {
            openModal('import-character', ({ id }) => <ImportFile id={id} title='Import Character' onSave={async (fileContent: string) => {
              try {
                const parsed = JSON.parse(fileContent)
                if (parsed.type === 'character') {
                  importCharacter(parsed.item)
                }
              } catch (e) {
                console.error(e)
              }
            }} />)
          }}>Import Adventurer</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}
