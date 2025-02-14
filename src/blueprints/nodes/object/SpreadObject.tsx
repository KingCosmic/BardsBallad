import { memo, useEffect, useMemo, useState } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useNodeConnections,
  useNodesData
} from '@xyflow/react'

import { systemState } from '../../../state/system'
import { SystemType } from '../../../state/systems'
import Card from '../../../components/Card'
 
function SpeadObject({ id, data: { inputType } }: NodeProps<Node<{ inputType: SystemType }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()

  const connections = useNodeConnections()
  const nodeIds = useMemo(() => connections.filter(c => c.source !== id).map(c => c.source), [connections])
  const nodes = useNodesData(nodeIds)

  useEffect(() => {
    let input: { [key:string]: SystemType | null } = {}

    for (let c = 0; c < connections.length; c++) {
      const conn = connections[c]

      const type = (conn.source === id) ? 'output' : 'input'

      if (type === 'output') continue

      const node = nodes.find(n => n.id === conn.source)

      if (!node?.data || !node?.data.outputs) continue

      const nodeData = (node?.data?.outputs as { [key:string]: SystemType | null })[conn.sourceHandle ?? '']

      input[conn.targetHandle ?? ''] = nodeData
    }

    const typeInput = input['input-object'] ?? { name: 'unknown', properties: [] }

    updateNodeData(id, { inputs: input, inputType: typeInput })
    updateNodeInternals(id)
  }, [connections, nodes, system])

  return (
    <Card title='Spread Object'>
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'left' }}>Input Type {inputType?.name}</p>
      <p style={{ textAlign: 'right' }}>Spread</p>

      {
        inputType?.properties?.map(prop => (
          <p key={prop.key} style={{ textAlign: 'right', marginTop: 5 }}>
            ({prop.typeData.type}{prop.typeData.isArray ? '[]' : ''}) {prop.key}
          </p>
        ))
      }

      <Handle type='target' id='input-object' position={Position.Left}
        style={{ top: 80, bottom: 'auto' }}
      />

      {inputType?.properties?.map((prop, i) => (
        <Handle key={prop.key} type='source' id={`${prop.key}-${prop.typeData.type}${prop.typeData.isArray ? '(Array)' : ''}`} position={Position.Right}
          style={{ top: 130 + (26 * i), bottom: 'auto' }}
        />
      ))}
    </Card>
  )
}
 
export default memo(SpeadObject)