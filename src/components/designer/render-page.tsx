import { PageData } from "@/db/system/schema"
import { useMemo } from "react"
import lz from 'lzutf8'
import RenderEditorData from "./RenderEditorData"

interface Props {
  page: PageData,
  currentTab: string,
  state: any,
  updateState(state: any): void
}

export default function RenderPage({ page, currentTab, state, updateState }: Props) {
  const data = useMemo(() => {
    if (!page.lexical) return {}

    return JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))
  }, [page.lexical])

  if ((currentTab !== page.name)) return <></>

  return (
    <RenderEditorData data={data} state={state} updateState={updateState} />
  )
}