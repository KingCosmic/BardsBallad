import { memo } from 'react'

import Card from '../../components/Card'

import {
  Handle,
  type NodeProps,
  type Node,
  Position
} from '@xyflow/react'

import { Param } from '../utils'

const EntryNode: React.FC<NodeProps<Node<{ params: Param[] }>>> = ({ id, data: { params } }) => {
  return (
    <Card title='Entry'>
      <Handle type='source' id='start-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      {
        params.map(p => (
          <p key={p.name} style={{ textAlign: 'right', marginTop: 5 }}>
            ({p.type}{p.isArray ? '[]' : ''}) {p.name}
          </p>
        ))
      }

      {
        params.map((p, i) => (
          <Handle key={p.name} type='source' id={`${p.name}-${p.type}`} position={Position.Right}
            style={{ top: 85 + (25 * i), bottom: 'auto' }}
          />
        ))
      }
    </Card>
  )
}
 
export default memo(EntryNode)