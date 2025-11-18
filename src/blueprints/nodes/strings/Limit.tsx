import { memo, useCallback } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react'

import Card from '@components/Card'
import TextInput from '@components/inputs/TextInput';
 
function StringLimit({ id, data: { input, limitLength }}: NodeProps<Node<{ input: string, limitLength: number }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const updateLength = useCallback((length: string) => {
    updateNodeData(id, { limitLength: parseInt(length) })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals])

  return (
    <Card title='String Compare'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ marginTop: 5 }}>
        String
      </p>

      <TextInput id='limit length' type='number' label='Length To Limit to' value={''+limitLength} onChange={updateLength} isValid errorMessage='' />

      <p style={{ textAlign: 'right', marginTop: 5 }}>
        (string) limited string
      </p>

      <Handle type='target' id='input-string' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='source' id='output-string' position={Position.Right}
        style={{ top: 120, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(StringLimit)
