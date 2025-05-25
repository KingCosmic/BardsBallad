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
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'
 
function Filter({ id, data: { inputType } }: NodeProps<Node<{ inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  useNodeConnections({
    handleType: 'target',
    handleId: 'input-array',
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
    <Card title='Filter Array'>
      <p style={{ textAlign: 'left' }}>Input Type {inputType}</p>
      <p style={{ textAlign: 'right' }}>Loop Body</p>

      {
        (inputType !== 'unknown') && (
          <>
            <p style={{ textAlign: 'left', marginTop: 15 }}>Loop Completed</p>
            <p style={{ textAlign: 'left', marginTop: 5 }}>Filtered? (boolean)</p>
            <p style={{ textAlign: 'right', marginTop: 15 }}>
              ({inputType}) item
            </p>
          </>
        )
      }

      {
        (inputType !== 'unknown') && (
          <>
            <p style={{ textAlign: 'right', marginTop: 20 }}>Completed</p>
            <p style={{ textAlign: 'right', marginTop: 5 }}>Filtered Array</p>
          </>
        )
      }

      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='target' id='input-array' position={Position.Left}
        style={{ top: 65, bottom: 'auto' }}
      />
      <Handle type='source' id='loop-node' position={Position.Right}
        style={{ top: 90, bottom: 'auto' }}
      />

      {
        (inputType !== 'unknown') && (
          <>
            {/* Input Handles */}
            <Handle type='target' id='loopcompleted-node' position={Position.Left}
              style={{ top: 125, bottom: 'auto' }}
            />
            <Handle type='target' id='filtered?-boolean' position={Position.Left}
              style={{ top: 150, bottom: 'auto' }}
            />

            {/* Output Handles */}
            <Handle type='source' id={`output-${inputType}`} position={Position.Right}
              style={{ top: 188, bottom: 'auto' }}
            />
            <Handle type='source' id='completed-node' position={Position.Right}
              style={{ top: 228, bottom: 'auto' }}
            />
            <Handle type='source' id={`filterd-${inputType}(Array)`} position={Position.Right}
              style={{ top: 255, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Filter)
