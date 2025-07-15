import { memo, useEffect, useMemo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
  useNodeConnections,
  useNodesData,
} from '@xyflow/react'
import Card from '@components/Card'

import { getReturnTypeOfBlueprint } from '@utils/Blueprints/getReturnTypeOfBlueprint'
import { getParamsOfBlueprint } from '@utils/Blueprints/getParamsOfBlueprint'
import { Param } from '@blueprints/utils'

const RunBlueprint: React.FC<NodeProps<Node<{ params: Param[], returnType: string, inputs: { [key:string]: { type: string, data: any } }, outputs: { [key:string]: { type: string, data: any } } }>>> = ({ id, data: { params, returnType, inputs, outputs } }) => {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const connections = useNodeConnections()
  const nodeIds = useMemo(() => connections.filter(c => c.source !== id).map(c => c.source), [connections])
  const nodes = useNodesData(nodeIds)

  useEffect(() => {
    let input: { [key:string]: { type: string, data: any } } = {}

    for (let c = 0; c < connections.length; c++) {
      const conn = connections[c]

      const type = (conn.source === id) ? 'output' : 'input'

      if (type === 'output') continue

      const node = nodes.find(n => n.id === conn.source)

      if (node?.data || node?.data.outputs) continue

      const nodeData = (node?.data?.outputs as { [key:string]: { type: string, data: any } })[conn.sourceHandle || '']

      input[conn.targetHandle || ''] = nodeData
    }

    const bp = input['data-blueprint']?.data

    let params: Param[] = []
    let returnType = 'none'

    if (bp) {
      params = getParamsOfBlueprint(bp)
      returnType = getReturnTypeOfBlueprint(bp)
    }

    updateNodeData(id, { inputs: input, params, returnType })
    updateNodeInternals(id)
  }, [connections, nodes])

  return (
    <Card title='Run Blueprint'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <p style={{ marginTop: 10 }}>blueprint</p>
      <Handle type='target' id='data-blueprint' position={Position.Left}
        style={{ top: 60, bottom: 'auto' }}
      />

      {/* Make Input nodes */}
      {params.map((param, i) => {
        const type = `${param.type}${param.isArray ? '(Array)' : ''}`

        return (
          <div key={param.name}>
            <p>{param.name} {type}</p>
            <Handle type='target' id={`${param.name}-${type}`} position={Position.Left}
              style={{ top: 70 + (10 * i), bottom: 'auto' }}
            />
          </div>
        )
      })}

      {/* Make Output nodes */}
      {(returnType !== 'none') && (
        <div>
          <p>output {returnType}</p>
          <Handle type='source' id={`output-${returnType}`} position={Position.Right}
            style={{ top: 80 + (10 * params.length), bottom: 'auto' }}
          />
        </div>
      )}
    </Card>
  )
}
 
export default memo(RunBlueprint)
