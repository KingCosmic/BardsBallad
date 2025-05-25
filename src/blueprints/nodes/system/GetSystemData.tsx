import { memo, useCallback, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { editorState } from '@state/editor'

import Card from '@components/Card'
import Select from '@components/inputs/Select'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'
 
function GetSystemDataNode({ id, data: { path, type }, }: NodeProps<Node<{ path: string; type: string; pathData: any; }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()

  const version = useVersionEdits<SystemData>(editor.versionId)

  const updateTypeFromSelection = useCallback((name: string) => {
    const typeData = version?.data.data.find(d => d.name === name)?.typeData
    const type = typeData ? (`${typeData.type}${typeData.isArray ? '(Array)': ''}`) : 'unknown'

    updateNodeData(id, { path: name, type })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals])

  useEffect(() => {
    if (path) return

    const name = version?.data.data[0]?.name
    const typeData = version?.data.data[0]?.typeData
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
        {version?.data.data.map(d => <option value={d.name}>{d.name}</option>)}
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
