import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useUpdateNodeInternals,
  useReactFlow,
} from '@xyflow/react'

import { editorState } from '@state/editor'
import Card from '@components/Card'
import Select from '@components/inputs/Select'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'
 
function Create({ id, data: { outputType } }: NodeProps<Node<{ outputType: string }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  return (
    <Card title='Add Item To Array'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Select id={`type-${id}`} label='Type' value={outputType} onChange={type => {
        updateNodeData(id, { outputType: type, outputs: { [`output-${type}array`]: version?.data.types.find(t => t.name === type) } })
        updateNodeInternals(id)
      }}>
        {version?.data.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
      </Select>

      {
        (outputType !== 'unknown') && (
          <>
            <p style={{ textAlign: 'right', marginTop: 5 }}>{outputType}(Array) New Array</p>
          </>
        )
      }

      <Handle type='target' id='base-array' position={Position.Left}
        style={{ top: 80, bottom: 'auto' }}
      />

      {/* Output Handles */}
      {
        (outputType !== 'unknown') && (
          <>
            <Handle type='source' id={`output-${outputType}(Array)`} position={Position.Right}
              style={{ top: 130, bottom: 'auto' }}
            />
          </>
        )
      }
    </Card>
  )
}
 
export default memo(Create)
