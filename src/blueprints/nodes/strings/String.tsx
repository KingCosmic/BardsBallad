import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
} from '@xyflow/react'

import TextInput from '@components/inputs/TextInput'
import Card from '@components/Card'
 
function String({ id, data: { value }}: NodeProps<Node<{ value: string }>>) {
  const { updateNodeData } = useReactFlow()

  return (
    <Card title='String'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />
      
      <TextInput id={`string-${id}`} label='String Value' value={value} onChange={value => updateNodeData(id, { value })} isValid errorMessage='' />

      <Handle type='source' id='output-string' position={Position.Right}
        style={{ top: 100, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(String)
