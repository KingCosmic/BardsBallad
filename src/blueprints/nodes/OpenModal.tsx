import { memo } from 'react'

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
import TextInput from '@components/inputs/TextInput'
import { editorState } from '@state/editor'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { SystemData } from '@storage/schemas/system'

const OpenModal: React.FC<NodeProps<Node<{ type: string, title: string, inputType: string }>>> = ({ id, data: { type, title, inputType } }) => {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()
  const editor = editorState.useValue()
  
  const version = useVersionEdits<SystemData>(editor.versionId)

  useNodeConnections({
    handleType: 'target',
    handleId: 'data-any',
    onConnect: (conns) => {
      const conn = conns[0]

      if (!conn) return

      if (!conn.sourceHandle) return

      const sourceType = conn.sourceHandle.split('-')[1]
    
      if (!sourceType) return

      updateNodeData(id, { inputType: sourceType })
      updateNodeInternals(id)
    },
    onDisconnect: () => {
      updateNodeData(id, { inputType: 'unknown' })
      updateNodeInternals(id)
    }
  })

  return (
    <Card title='Open Modal'>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />

      <Select id='modal-type' label='Modal Type' value={type} onChange={type => updateNodeData(id, { type })}>
        <option value='edit_object'>Edit Object</option>
        <option value='edit_number'>Edit Number</option>
        <option value='edit_string'>Edit String</option>

        {version?.data.modals.map(m => (<option value={m.name}>{m.name}</option>))}
      </Select>

      <TextInput id='modal-title' label='Modal Title' value={title} onChange={title => updateNodeData(id, { title })} isValid errorMessage='' />

      <p style={{ marginTop: 10 }}>input data ({inputType})</p>
      <Handle type='target' id='data-any' position={Position.Left}
        style={{ top: 145, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'right' }}>on save</p>
      <Handle type='source' id='save-node' position={Position.Right}
        style={{ top: 168, bottom: 'auto' }}
      />

      <p style={{ textAlign: 'right' }}>data ({inputType})</p>
      <Handle type='source' id={`newdata-${inputType}`} position={Position.Right}
        style={{ top: 192, bottom: 'auto' }}
      />

      <p style={{ marginTop: 10, textAlign: 'right' }}>on delete</p>
      <Handle type='source' id='delete-node' position={Position.Right}
        style={{ top: 222, bottom: 'auto' }}
      />
    </Card>
  )
}
 
export default memo(OpenModal)
