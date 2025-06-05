import { memo, useCallback, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import getTypeFromProperty from '@utils/getTypeOfProperty'

import TextInput from '@components/inputs/TextInput'
import Card from '@components/Card'
import { editorState } from '@state/editor'
import { useSystem } from '@hooks/useSystem'
import { useVersionEdits } from '@hooks/useVersionEdits'
import system, { SystemData } from '@storage/schemas/system'
 
function SetCharacterDataNode({ id, data: { path, type } }: NodeProps<Node<{ path: string; type: string; }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  const updateTypeFromPath = useCallback((path: string) => {
    const type = getTypeFromProperty(version?.data.defaultCharacterData || {}, path)

    updateNodeData(id, { path, type })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals, system])

  return (
    <Card title='Set Character Data'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <TextInput id={`set-character-${id}`} label='Path' value={path} onChange={updateTypeFromPath} isValid errorMessage='' />

      <p>Calculated type {type}</p>

      {
        (type !== 'unknown') ? (
          <Handle type='target' id={`input-${type}`} position={Position.Left} style={{ bottom: 20, top: 'auto'}} />
        ) : null
      }
    </Card>
  )
}
 
export default memo(SetCharacterDataNode)
