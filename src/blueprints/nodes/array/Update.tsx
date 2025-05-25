import { memo, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useNodeConnections
} from '@xyflow/react'

import { editorState } from '@state/editor'
import Card from '@components/Card'
import { SystemData } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'
 
function Update({ id, data: { inputType } }: NodeProps<Node<{ inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  useNodeConnections({
    handleType: 'target',
    handleId: 'base-array',
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
    if (!version) return

    updateNodeInternals(id)
  }, [version, inputType])

  return (
    <Card title='Update Item In Array'>
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
            <p style={{ marginTop: 5 }}>name (string)</p>
            <p style={{ marginTop: 10 }}>new Item ({inputType})</p>
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
            <Handle type='target' id={`name-string`} position={Position.Left}
              style={{ top: 106, bottom: 'auto' }}
            />
            <Handle type='target' id={`newItem-${inputType}`} position={Position.Left}
              style={{ top: 138, bottom: 'auto' }}
            />

            {/* Output Handles */}
            <Handle type='source' id={`output-${inputType}(Array)`} position={Position.Right}
              style={{ top: 162, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Update)
