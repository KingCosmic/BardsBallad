import React, { useMemo } from 'react'
import type { PageData } from '@/db/system/schema'
import { BlockRegistryProvider } from '../context/BlockRegistryContext'
import { ViewerProvider } from '../context/ViewerContext'
import { ViewerCanvas } from './ViewerCanvas'
import { parseRefrainDocument } from '../serialization'
import { systemEditorBlockDefinitions } from '../system-blocks'

interface Props {
  page: PageData
  currentTab: string
  state: any
  updateState(state: any): void
}

const parseLexical = (lexical: unknown): unknown => {
  try {
    if (!lexical) return null
    if (typeof lexical === 'object') return lexical
    if (typeof lexical === 'string') return JSON.parse(lexical)
    return null
  } catch {
    return null
  }
}

const RenderRefrainPage: React.FC<Props> = ({ page, currentTab, state, updateState }) => {
  if (currentTab !== page.name) return null

  const blocks = useMemo(() => {
    if (!page.lexical) return []
    const parsed = parseLexical(page.lexical)
    if (!parsed) return []
    return parseRefrainDocument(parsed, systemEditorBlockDefinitions)
  }, [page.lexical])

  return (
    <BlockRegistryProvider definitions={systemEditorBlockDefinitions}>
      <ViewerProvider state={state} updateState={updateState}>
        <ViewerCanvas blocks={blocks} />
      </ViewerProvider>
    </BlockRegistryProvider>
  )
}

export default RenderRefrainPage
