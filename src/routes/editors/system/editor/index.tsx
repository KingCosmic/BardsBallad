import React, { useEffect, useMemo } from 'react'
import lz from 'lzutf8'
import * as automerge from '@automerge/automerge'

import { editorState } from '@/state/editor'
import { PageData, SystemData } from '@/db/system/schema'
import storeMutation from '@/db/version/methods/storeMutation'
import updateLexical from '@/db/system/methods/updateLexical'
import { EditorProvider, useEditor } from '@/refrain/context/EditorContext'
import { BlockRegistryProvider, useBlockRegistry } from '@/refrain/context/BlockRegistryContext'
import { EditorCanvas } from '@/refrain/components/EditorCanvas'
import { parseRefrainDocument, exportRefrainDocument } from '@/refrain/serialization'
import { systemEditorBlockDefinitions } from '@/refrain/system-blocks'

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
  return JSON.parse(lz.decompress(lz.decodeBase64(lexical)))
}

const EditorPersistence: React.FC<{ editsId: string }> = ({ editsId }) => {
  const { blocks } = useEditor()
  const { definitions } = useBlockRegistry()

  useEffect(() => {
    const payload = exportRefrainDocument(blocks, definitions)
    storeMutation(editsId, updateLexical(editsId, JSON.stringify(payload)))
  }, [blocks, definitions, editsId])

  return <EditorCanvas />
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

  return (
    <div className='mt-3 border-2 border-primary border-dashed rounded-lg dark:border-muted min-h-[20rem]'>
      <BlockRegistryProvider definitions={systemEditorBlockDefinitions}>
        <EditorProvider initialBlocks={initialBlocks}>
          <EditorPersistence editsId={editsId} />
        </EditorProvider>
      </BlockRegistryProvider>
    </div>
  )
}

export default EditorTab
