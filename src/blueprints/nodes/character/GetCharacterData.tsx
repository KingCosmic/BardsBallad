import { memo, useCallback, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import getTypeFromProperty from '../../../utils/getTypeOfProperty'
import { systemState } from '../../../state/system'

import TextInput from '../../../components/inputs/TextInput'
import Card from '../../../components/Card'
 
function GetCharacterDataNode({ id, data: { path, type }, }: NodeProps<Node<{ path: string; type: string; pathData: any; }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()

  const updateTypeFromPath = useCallback((path: string) => {
    const type = getTypeFromProperty(system?.defaultCharacterData || {}, path)

    updateNodeData(id, { path, type })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals])

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