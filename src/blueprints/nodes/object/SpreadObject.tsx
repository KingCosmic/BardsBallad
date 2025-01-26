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

import { systemState } from '../../../state/system'
import { SystemType } from '../../../state/systems'
import Card from '../../../components/Card'
 
function SpeadObject({ id, data: { inputType } }: NodeProps<Node<{ inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const [spreadType, setSpreadType] = useState<SystemType>({ name: '', properties: [] })

  const system = systemState.useValue()

  useNodeConnections({
    handleType: 'target',
    handleId: 'input-object',
    onConnect: (conns) => {
      const conn = conns[0]

      if (!conn) return

      if (!conn.sourceHandle) return

      const sourceType = conn.sourceHandle.split('-')[1]
    
      if (!sourceType) return

      updateNodeData(id, { inputType: sourceType })

      if (system) {
        setSpreadType(system.types.find(type => type.name === inputType) || { name: '', properties: [] })
      }

      updateNodeInternals(id)
    },
    onDisconnect: () => {
      updateNodeData(id, { inputType: 'unknown' })
      updateNodeInternals(id)
    }
  })

  useEffect(() => {
    if (!system) return

    setSpreadType(system.types.find(type => type.name === inputType) || { name: '', properties: [] })
    updateNodeInternals(id)
  }, [system, inputType])

  return (
    <Card title='Spread Object'>
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'left' }}>Input Type {inputType}</p>
      <p style={{ textAlign: 'right' }}>Spread</p>

      {
        spreadType.properties.map(prop => (
          <p key={prop.key} style={{ textAlign: 'right', marginTop: 5 }}>
            ({prop.typeData.type}{prop.typeData.isArray ? '[]' : ''}) {prop.key}
          </p>
        ))
      }

      <Handle type='target' id='input-object' position={Position.Left}
        style={{ top: 80, bottom: 'auto' }}
      />

      {
        spreadType.properties.map((prop, i) => (
          <Handle key={prop.key} type='source' id={`${prop.key}-${prop.typeData.type}${prop.typeData.isArray ? '(Array)' : ''}`} position={Position.Right}
            style={{ top: 130 + (26 * i), bottom: 'auto' }}
          />
        ))
      }
    </Card>
  )
}
 
export default memo(SpeadObject)