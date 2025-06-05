import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useNodeConnections,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { Param } from '@blueprints/utils'
import Card from '@components/Card'
 
function OutputNode({ id, data: { param, inputType } }: NodeProps<Node<{ param: Param, inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const inputID = `${param.name}-${param.isArray ? 'array' : param.type}`

  useNodeConnections({
    handleType: 'target',
    handleId: inputID,
    onConnect: (conns) => {
      const conn = conns[0]

      if (!conn) return

      if (!conn.sourceHandle) return

      const sourceType = conn.sourceHandle.split('-')[1]
    
      if (!sourceType) return

      const inputType = sourceType.split('(')[0]

      if (!inputType) return

      updateNodeData(id, { inputType })
      updateNodeInternals(id)
    },
    onDisconnect: () => {
      updateNodeData(id, { inputType: 'any' })
      updateNodeInternals(id)
    }
  })

  return (
    <Card title='Output'>
      <Handle type='target' id='end-node' position={Position.Left}
        style={{ top: 28, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'left', marginTop: 5 }}>
        {
          (param.isArray) ? `${inputType}${param.isArray ? '(Array)' : ''}` : param.type
        }
      </p>

      <Handle type='target' id={inputID} position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(OutputNode)

