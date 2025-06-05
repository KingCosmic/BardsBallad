import { memo, useEffect, useState } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useNodeConnections
} from '@xyflow/react'

import Card from '@components/Card'
import Select from '@components/inputs/Select'
import { editorState } from '@state/editor'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'
 
function Map({ id, data: { inputType, mapType } }: NodeProps<Node<{ inputType: string, mapType: string }>>) {
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

  return (
    <Card title='Map Array'>
      <p style={{ textAlign: 'left' }}>Input Type {inputType}</p>
      <p style={{ textAlign: 'right' }}>Loop Body</p>

      <Select id={`map-type-${id}`} label='Input Type' value={mapType} onChange={mt => {
        updateNodeData(id, { mapType: mt })
        updateNodeInternals(id)
      }}>
        {version?.data.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
      </Select>

      {
        (inputType !== 'unknown') && (
          <>
            <p style={{ textAlign: 'left', marginTop: 15 }}>Loop Completed</p>
            <p style={{ textAlign: 'left', marginTop: 5 }}>item ({mapType})</p>
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
            <p style={{ textAlign: 'right', marginTop: 5 }}>New Array</p>
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
            <Handle type='target' id={`newitem-${inputType}`} position={Position.Left}
              style={{ top: 150, bottom: 'auto' }}
            />

            {/* Output Handles */}
            <Handle type='source' id={`output-${inputType}`} position={Position.Right}
              style={{ top: 188, bottom: 'auto' }}
            />
            <Handle type='source' id='completed-node' position={Position.Right}
              style={{ top: 228, bottom: 'auto' }}
            />
            <Handle type='source' id={`filterd-${mapType}(Array)`} position={Position.Right}
              style={{ top: 255, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Map)
