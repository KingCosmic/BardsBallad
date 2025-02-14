import { memo, useCallback, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { systemState } from '../../../state/system'

import Card from '../../../components/Card'
import Select from '../../../components/inputs/Select'
 
function GetSystemDataNode({ id, data: { path, type }, }: NodeProps<Node<{ path: string; type: string; pathData: any; }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()

  const updateTypeFromSelection = useCallback((name: string) => {
    const typeData = system?.data.find(d => d.name === name)?.typeData
    const type = typeData ? (`${typeData.type}${typeData.isArray ? '(Array)': ''}`) : 'unknown'

    updateNodeData(id, { path: name, type })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals])

  useEffect(() => {
    if (path) return

    const name = system?.data[0]?.name
    const typeData = system?.data[0]?.typeData
    const type = typeData ? (`${typeData.type}${typeData.isArray ? '(Array)': ''}`) : 'unknown'

    updateNodeData(id, { path: name, type })
    updateNodeInternals(id)
  }, [])

  return (
    <Card title='Get System Data'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Select id={`get-system-${id}`} label='Data' value={path} onChange={updateTypeFromSelection}>
        {system?.data.map(d => <option value={d.name}>{d.name}</option>)}
      </Select>

      <p>Calculated type {type}</p>

      {
        (type !== 'unknown') ? (
          <Handle type='source' id={`output-${type}`} position={Position.Right} style={{ bottom: 20, top: 'auto'}} />
        ) : null
      }
    </Card>
  )
}
 
export default memo(GetSystemDataNode)