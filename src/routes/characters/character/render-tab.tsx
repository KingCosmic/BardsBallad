import RenderPage from "@/components/designer/render-page"
import { useScriptRunner } from "@/components/providers/script-runner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { SystemData } from "@/db/system/schema"
import { memo, useState } from "react"

interface Props {
  system: SystemData,
  state: any,
  updateState(state: any): void
}

export default memo(({ system, state, updateState }: Props) => {
  const [tab, setTab] = useState(system.pages[0].name)

  const { isReady } = useScriptRunner()

  if (!isReady) return <Spinner />

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
        system.pages.map(page => <RenderPage key={page.name} page={page} currentTab={tab} state={state} updateState={updateState} />)
      }
    </>
  )
})