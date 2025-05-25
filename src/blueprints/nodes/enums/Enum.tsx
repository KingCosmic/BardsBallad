import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
} from '@xyflow/react'

import Card from '@components/Card'
import TextInput from '@components/inputs/TextInput'
 
function Enum({ id, data: { value }}: NodeProps<Node<{ value: string }>>) {
  const { updateNodeData } = useReactFlow()
  
  return (
    <Card title='Enum'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <TextInput id={`enum-${id}`} label='String Value' value={value} onChange={value => updateNodeData(id, { value })} isValid errorMessage='' />

      <Handle type='source' id='output-enum' position={Position.Right}
        style={{ top: 100, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(Enum)
