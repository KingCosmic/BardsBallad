import { IconFolderCode } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { openModal } from "@/state/modals"
import ImportFile from "@/modals/import-file"
import importItem from "@/db/shared/methods/importItem"

export default function NoSubscriptions() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Subscriptions</EmptyTitle>
        <EmptyDescription>
          You don't have any subscriptions, check the marketplace or create / import one.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className='flex gap-2'>
          <Button onClick={() =>
            openModal('import-system', ({ id }) => <ImportFile id={id} title='Import Item' onSave={async (fileContent: string) => {
              try {
                const parsed = JSON.parse(fileContent)
                await importItem(parsed.type, parsed.item, parsed.version)
              } catch (e) {
                console.error(e)
              }
            }} />
          )}>Import</Button>
          <Button>Create</Button>
          <Button variant='outline'>Check Marketplace</Button>
        </div>
      </EmptyContent>
    </Empty>
  )
}