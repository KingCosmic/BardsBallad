import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'

import Card from '@components/Card'
 
function BooleanBranch(_props: NodeProps<Node<{ boolean: boolean; }>>) {
  return (
    <Card title='Branch'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ marginTop: 5 }}>
        input (boolean)
      </p>

      <p style={{ textAlign: 'right', marginTop: 5 }}>
        true
      </p>

      <p style={{ textAlign: 'right', marginTop: 5 }}>
        false
      </p>

      <Handle type='target' id='input-boolean' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='source' id='true-node' position={Position.Right}
        style={{ top: 110, bottom: 'auto' }}
      />

      <Handle type='source' id='false-node' position={Position.Right}
        style={{ top: 136, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(BooleanBranch)
