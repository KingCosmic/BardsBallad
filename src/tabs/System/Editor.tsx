import { useEffect } from 'react'

import { Frame, Element, useEditor } from '@craftjs/core'

import Container from '../../designer/components/Container'
import Text from '../../designer/components/Text'

import { systemState } from '../../state/system'
import { editorState } from '../../state/editor'

import { getDefaultNodes } from '../../blueprints/utils'

import lz from 'lzutf8'

function EditorTab() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  const { actions } = useEditor()

  useEffect(() => {
    const lexical = system?.pages.find(p => p.name === editor.page)?.lexical

    if (!lexical) return

    actions.deserialize(lz.decompress(lz.decodeBase64(lexical)))
  }, [editor.page])

  if (!system) return <></>

  return (
    <div className='mt-3 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700'>
      <Frame>
        <Element is={Container} canvas>
          <Text text='Testing the world' fontSize={32}
            blueprint={{
              nodes: getDefaultNodes(
                [],
                {
                  name: 'text',
                  type: 'string',
                  isArray: false
                }
              ),
              edges: []
            }}
          />
        </Element>
      </Frame>
    </div>
  )
}

export default EditorTab