import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'
import Card from '@components/Card';
 
function Floor(_props: NodeProps<Node<{ number: number; }>>) {
  return (
    <Card title='Floor'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ marginTop: 5 }}>
        number
      </p>

      <p style={{ marginTop: 5 }}>
        output
      </p>

      <Handle type='target' id='input-number' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='source' id='output-number' position={Position.Right}
        style={{ top: 110, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(Floor)
