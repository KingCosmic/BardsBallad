import { memo, useState } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow
} from '@xyflow/react'

import { editorState } from '@state/editor'
import { SystemData, type SystemType } from '@storage/schemas/system'
import Card from '@components/Card'
import Select from '@components/inputs/Select'
import { useVersionEdits } from '@hooks/useVersionEdits'
 
function CreateDataFromType({ id, data: { spreadType } }: NodeProps<Node<{ spreadType: SystemType }>>) {
  const { updateNodeData } = useReactFlow()

  const editor = editorState.useValue()

  const version = useVersionEdits<SystemData>(editor.versionId)

  return (
    <Card title='Create Object From Type'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Select id={`type-${id}`} label='Type' value={spreadType.name} onChange={type => updateNodeData(id, { spreadType: version?.data.types.find(t => t.name === type) })}>
        {version?.data.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
      </Select>

      {
        spreadType.properties.map(prop => (
          <p key={prop.key} style={{ marginTop: 5 }}>
            ({prop.typeData.type}{prop.typeData.isArray ? '[]' : ''}) {prop.key}
          </p>
        ))
      }

      <p style={{ textAlign: 'right' }}>({spreadType.name}) output</p>

      {
        spreadType.properties.map((prop, i) => (
          <Handle key={prop.key} type='target' id={`${prop.key}-${prop.typeData.type}${prop.typeData.isArray ? '(Array)' : ''}`} position={Position.Left}
            style={{ top: 129 + (26 * i), bottom: 'auto' }}
          />
        ))
      }

      <Handle type='source' id={`output-${spreadType.name}`} position={Position.Right}
        style={{ top: 129 + (24 *  spreadType.properties.length), bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(CreateDataFromType)
