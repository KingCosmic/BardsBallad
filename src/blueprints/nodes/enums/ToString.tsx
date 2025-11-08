import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'

import Card from '@components/Card'
 
function ToString(_props: NodeProps<Node<{ string1: string; string2: string; }>>) {
  return (
    <Card title='Enum To String'>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ marginTop: 5 }}>
        Enum
      </p>
      <p style={{ textAlign: 'right', marginTop: 5 }}>
        (string) output
      </p>

      <Handle type='target' id='enum-enum' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='source' id='output-string' position={Position.Right}
        style={{ top: 136, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(ToString)