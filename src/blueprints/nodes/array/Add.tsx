import { memo, useEffect, useState } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useHandleConnections
} from '@xyflow/react'

import { systemState } from '../../../state/system'
import Card from '../../../components/Card'
 
function Add({ id, data: { inputType } }: NodeProps<Node<{ inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()

  useHandleConnections({
    type: 'target',
    id: 'base-array',
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
      updateNodeData(id, { inputType: 'unknown' })
      updateNodeInternals(id)
    }
  })

  useEffect(() => {
    if (!system) return

    updateNodeInternals(id)
  }, [system, inputType])

  return (
    <Card title='Add Item To Array'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'left' }}>Type {inputType}(Array)</p>

      {
        (inputType !== 'unknown') && (
          <>
            <p style={{ marginTop: 5 }}>new Item ({inputType})</p>
            <p style={{ textAlign: 'right', marginTop: 5 }}>{inputType}(Array) New Array</p>
          </>
        )
      }

      <Handle type='target' id='base-array' position={Position.Left}
        style={{ top: 80, bottom: 'auto' }}
      />

      {
        (inputType !== 'unknown') && (
          <>
            {/* Input Handles */}
            <Handle type='target' id={`newItem-${inputType}`} position={Position.Left}
              style={{ top: 106, bottom: 'auto' }}
            />

            {/* Output Handles */}
            <Handle type='source' id={`output-${inputType}(Array)`} position={Position.Right}
              style={{ top: 130, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Add)