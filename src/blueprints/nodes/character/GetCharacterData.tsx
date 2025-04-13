import { memo, useCallback, useEffect, useMemo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useNodeConnections,
  useNodesData
} from '@xyflow/react'

import getTypeFromProperty from '../../../utils/getTypeOfProperty'

import TextInput from '../../../components/inputs/TextInput'
import Card from '../../../components/Card'
import { editorState } from '../../../state/editor'
import { useSystem } from '../../../hooks/useSystem'
import { type SystemType } from '../../../newstorage/schemas/system'
 
function GetCharacterDataNode({ id, data: { path, type, outputs }, }: NodeProps<Node<{ path: string; type: string; outputs: { [key:string]: SystemType | null } }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const system = useSystem(editor.systemId)

  const updateTypeFromPath = useCallback((path: string) => {
    const type = getTypeFromProperty(system?.defaultCharacterData || {}, path)

    const typeName = type.split('(')[0]

    updateNodeData(id, { path, type, outputs: { [`output-${type}`]: system?.types.find(t => t.name === typeName) } })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals, system])

  return (
    <Card title='Get Character Data'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <TextInput id={`get-character-${id}`} label='Path' value={path} onChange={updateTypeFromPath} isValid errorMessage='' />

      <p>Calculated type {type}</p>

      {
        (type !== 'unknown') ? (
          <Handle type='source' id={`output-${type}`} position={Position.Right} style={{ bottom: 20, top: 'auto'}} />
        ) : null
      }
    </Card>
  )
}
 
export default memo(GetCharacterDataNode)