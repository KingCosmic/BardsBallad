import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
} from '@xyflow/react'

import Card from '@components/Card'
import Checkbox from '@components/inputs/Checkbox'
 
function Boolean({ id, data: { value }}: NodeProps<Node<{ value: boolean }>>) {
  const { updateNodeData } = useReactFlow()

  return (
    <Card title='Boolean'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Checkbox id={`boolean-${id}`} label='Value' checked={value} onChange={value => updateNodeData(id, { value })} />

      <Handle type='source' id='output-boolean' position={Position.Right}
        style={{ top: 100, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(Boolean)
