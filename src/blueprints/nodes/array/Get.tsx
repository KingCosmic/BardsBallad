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

import { editorState } from '../../../state/editor'
import Card from '../../../components/Card'
import { useSystem } from '../../../hooks/useSystem'
import { SystemType } from '../../../types/system'
 
function Add({ id, data: { inputType } }: NodeProps<Node<{ inputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const {system} = useSystem(editor.systemId)

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

      console.log(conn.sourceHandle)

      const nodeData = (node?.data?.outputs as { [key:string]: SystemType | null })[conn.sourceHandle ?? '']

      console.log(nodeData)

      input[conn.targetHandle ?? ''] = nodeData
    }

    console.log(input)

    const inputType = (input['base-array'] ?? { name: 'unknown', properties: [] }).name

    updateNodeData(id, { inputs: input, inputType, outputs: { [`output-${inputType}`]: system?.types.find(t => t.name === inputType) } })
    updateNodeInternals(id)
  }, [connections, nodes, system])

  // useNodeConnections({
  //   handleType: 'target',
  //   handleId: 'base-array',
  //   onConnect: (conns) => {
  //     const conn = conns[0]

  //     if (!conn) return

  //     if (!conn.sourceHandle) return

  //     const sourceType = conn.sourceHandle.split('-')[1]
    
  //     if (!sourceType) return


  //     const inputType = sourceType.split('(')[0]

  //     if (!inputType) return

  //     updateNodeData(id, { inputType })
  //     updateNodeInternals(id)
  //   },
  //   onDisconnect: () => {
  //     updateNodeData(id, { inputType: 'unknown' })
  //     updateNodeInternals(id)
  //   }
  // })

  useEffect(() => {
    if (!system) return

    updateNodeInternals(id)
  }, [system, inputType])

  return (
    <Card title='Get Item In Array'>
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
            <p style={{ textAlign: 'right', marginTop: 5 }}>{inputType} Item</p>
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
            <Handle type='target' id='name-string' position={Position.Left}
              style={{ top: 106, bottom: 'auto' }}
            />

            {/* Output Handles */}
            <Handle type='source' id={`output-${inputType}`} position={Position.Right}
              style={{ top: 130, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Add)