import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow
} from '@xyflow/react'

import Card from '@components/Card'
import TextInput from '@components/inputs/TextInput'
 
function SetSystemDataNode({ id, data }: NodeProps<Node<{ path: string }>>) {
  const { updateNodeData } = useReactFlow()
  
  const type = 'unknown'

  return (
    <Card title='Set System Data'>
      <TextInput id='path' label='Path' placeholder='path/to/data' value={data.path} onChange={path => updateNodeData(id, { path })} isValid errorMessage='' />

      <p>Calculated type {type}</p>

      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </Card>
  )
}
 
export default memo(SetSystemDataNode)
