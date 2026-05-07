import React, { useEffect, useMemo } from 'react'
import * as automerge from '@automerge/automerge'

import { editorState, setCreatorPage } from '@/state/editor'
import { PageData, SystemData } from '@/db/system/schema'
import updateLexical from '@/db/system/methods/updateLexical'
import { EditorProvider, useEditor } from '@/refrain/context/EditorContext'
import { BlockRegistryProvider, useBlockRegistry } from '@/refrain/context/BlockRegistryContext'
import { EditorCanvas } from '@/refrain/components/EditorCanvas'
import { EditorBridge } from '@/refrain/components/EditorBridge'
import { parseRefrainDocument, exportRefrainDocument } from '@/refrain/serialization'
import { systemEditorBlockDefinitions } from '@/refrain/system-blocks'
import { db } from '@/db'

interface Props {
  editsId: string
  doc: automerge.next.Doc<SystemData>
}

const defaultBlocks = [
  {
    id: 'default-text-block',
    type: 'text',
    props: {
      text: 'Add blocks to build your character creation wizard.',
    },
  },
]

const parseLexical = (lexical: unknown) => {
  try {
    if (!lexical) return null
    if (typeof lexical === 'object') return lexical
    if (typeof lexical === 'string') return JSON.parse(lexical)
    return null
  } catch {
    return null
  }
}

const CreatorPersistence: React.FC<Props> = ({ editsId, doc }) => {
  const { blocks } = useEditor()
  const { definitions } = useBlockRegistry()

  useEffect(() => {
    const timer = setTimeout(async () => {
      const item = await db.docs.get(editsId)
      if (!item?.doc) return
      const currentDoc = automerge.load<typeof doc>(item.doc)
      const payload = exportRefrainDocument(blocks, definitions)
      await db.docs.update(editsId, {
        doc: automerge.save(updateLexical(currentDoc as typeof doc, payload))
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [blocks, definitions, editsId])

  return (
    <>
      <EditorBridge />
      <EditorCanvas />
    </>
  )
}

const CreatorTab: React.FC<Props> = ({ editsId, doc }) => {
  const editor = editorState.useValue()

  const initialBlocks = useMemo(() => {
    const lexical = doc.creator.find((p: PageData) => p.name === editor.creatorPage)?.lexical
    if (!lexical) return defaultBlocks

    try {
      const parsed = parseLexical(lexical)
      if (!parsed) return defaultBlocks
      const blocks = parseRefrainDocument(parsed, systemEditorBlockDefinitions)
      return blocks.length > 0 ? blocks : defaultBlocks
    } catch (error) {
      console.error('Error parsing lexical payload:', error)
      return defaultBlocks
    }
  }, [doc, editor.creatorPage])

  useEffect(() => {
    const page = doc.creator.find(p => p.name === editor.creatorPage)
    const nextPage = page !== undefined ? page.name : (doc.creator[0]?.name ?? 'none')
    if (nextPage !== editor.creatorPage) {
      setCreatorPage(nextPage)
    }
  }, [doc.creator, editor.creatorPage])

  if (doc.creator.length === 0) {
    return (
      <div className='mt-3 rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground text-sm'>
        No builder pages yet. Add a page from the sidebar to get started.
      </div>
    )
  }

  return (
    <div className='relative mt-3 rounded-lg overflow-visible bg-background border border-border min-h-80'>
      <div className='absolute top-1.5 left-3 text-[10px] text-muted-foreground select-none z-10'>preview</div>
      <BlockRegistryProvider key={editor.creatorPage} definitions={systemEditorBlockDefinitions}>
        <EditorProvider initialBlocks={initialBlocks}>
          <CreatorPersistence editsId={editsId} doc={doc} />
        </EditorProvider>
      </BlockRegistryProvider>
    </div>
  )
}

export default CreatorTab
