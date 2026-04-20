import RenderRefrainPage from "@/refrain/components/RenderRefrainPage"
import { useScriptRunner } from "@/components/providers/script-runner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { SystemData } from "@/db/system/schema"
import { memo, useEffect, useState } from "react"

interface Props {
  system: SystemData,
  state: any,
  updateState(state: any): void
}

export default memo(({ system, state, updateState }: Props) => {
  const initialPage = system.pages[0]?.name ?? ''
  const [tab, setTab] = useState(initialPage)

  const { isReady } = useScriptRunner()

  useEffect(() => {
    if (system.pages.some(page => page.name === tab)) return
    setTab(initialPage)
  }, [initialPage, system.pages, tab])

  if (!isReady) return <Spinner />
  if (system.pages.length === 0) return <p className='text-sm text-muted-foreground mt-2'>No character pages available for this system.</p>

  return (
    <>
      <Select value={tab} onValueChange={setTab}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Tab' />
        </SelectTrigger>
        <SelectContent>
          {
            system.pages.map(page => (
              <SelectItem key={page.name} value={page.name}>{page.name}</SelectItem>
            ))
          }
        </SelectContent>
      </Select>
      
      {
        system.pages.map(page => <RenderRefrainPage key={page.name} page={page} currentTab={tab} state={state} updateState={updateState} />)
      }
    </>
  )
})
