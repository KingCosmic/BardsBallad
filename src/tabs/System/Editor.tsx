import { Frame, Element, useEditor } from '@craftjs/core'
import Text from '../../designer/components/Text'
import { systemState } from '../../state/system'
import { editorState } from '../../state/editor'
import { useEffect } from 'react'
import Container from '../../designer/components/Container'
import { getDefaultNodes } from '../../blueprints/utils'

import lz from 'lzutf8'

function Editor() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  const { actions, query } = useEditor()

  if (!system) return <></>

  useEffect(() => {
    const pageData = system.pages.find(p => p.name === editor.page)?.lexical
    
    let lexical = pageData

    if (!lexical) {

      return
    }

    actions.deserialize(lz.decompress(lz.decodeBase64(lexical)))
  }, [editor.page])

  return (
    <div style={{
      marginTop: 10,
      borderRadius: '4px',
      borderColor: 'gray',
      borderWidth: '1px'
    }}>
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

export default Editor