import React, { useEffect, useMemo } from 'react'
import lz from 'lzutf8'
import * as automerge from '@automerge/automerge'

import { editorState, setCharacterPage } from '@/state/editor'
import { PageData, SystemData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
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
      text: 'Testing the world',
    },
  },
]

const parseLexical = (lexical: string) => {
  try {
    return JSON.parse(lz.decompress(lz.decodeBase64(lexical)))
  } catch (error) {
    throw new Error('Invalid lexical payload: failed to decode or parse compressed editor data')
  }
}

const EditorPersistence: React.FC<Props> = ({ editsId, doc }) => {
  const { blocks } = useEditor()
  const { definitions } = useBlockRegistry()

  // Debounce saves and always fetch the latest doc binary from Dexie right
  // before applying the change. This avoids automerge's "outdated document"
  // error that occurs when automerge.change() is called twice on the same
  // doc reference (automerge v2 invalidates a doc after changing it).
  useEffect(() => {
    const timer = setTimeout(async () => {
      const item = await db.docs.get(editsId)
      if (!item?.doc) return
      const currentDoc = automerge.load<typeof doc>(item.doc)
      const payload = exportRefrainDocument(blocks, definitions)
      await db.docs.update(editsId, {
        doc: automerge.save(updateLexical(currentDoc as typeof doc, JSON.stringify(payload)))
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

const EditorTab: React.FC<Props> = ({ editsId, doc }) => {
  const editor = editorState.useValue()

  const initialBlocks = useMemo(() => {
    const lexical = doc.pages.find((p: PageData) => p.name === editor.characterPage)?.lexical
    if (!lexical) return defaultBlocks

    try {
      const parsed = parseLexical(lexical)
      const blocks = parseRefrainDocument(parsed, systemEditorBlockDefinitions)
      return blocks.length > 0 ? blocks : defaultBlocks
    } catch (error) {
      console.error('Error parsing lexical payload:', error)
      return defaultBlocks
    }
  }, [doc, editor.characterPage])

  useEffect(() => {
    const page = doc.pages.find(p => p.name === editor.characterPage)

    setCharacterPage(page !== undefined ? page.name : (doc.pages[0].name ?? 'none'))
  }, [doc.pages])

  return (
    <div className='relative mt-3 rounded-lg overflow-visible bg-background border border-border min-h-80'>
      <div className='absolute top-1.5 left-3 text-[10px] text-muted-foreground select-none z-10'>preview</div>
      <BlockRegistryProvider key={editor.characterPage} definitions={systemEditorBlockDefinitions}>
        <EditorProvider initialBlocks={initialBlocks}>
          <EditorPersistence editsId={editsId} doc={doc} />
        </EditorProvider>
      </BlockRegistryProvider>
    </div>
  )
}

export default EditorTab
