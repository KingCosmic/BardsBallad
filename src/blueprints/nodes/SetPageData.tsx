import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { editorState } from '../../state/editor'
import { systemState } from '../../state/system'
import { TypeData } from '../../state/systems'

import Select from '../../components/inputs/Select'
import Card from '../../components/Card'
 
function SetPageDataNode({ id, data: { chosenState } }: NodeProps<Node<{ chosenState: { name: string, type: TypeData } | null }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const system = systemState.useValue()
  const editor = editorState.useValue()

  return (
    <Card title='Set Page State'>
      <Select id={`set-state-${id}`} label='State to change' value={chosenState?.name || ''} onChange={state => {
        updateNodeData(id, { chosenState: system?.pages.find(p => p.name === editor.page)?.state.find(s => s.name === state) })
        updateNodeInternals(id)
      }}>
        {system?.pages.find(p => p.name === editor.page)?.state.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
      </Select>

      {
        chosenState ? (
          <p>{chosenState.type.type}{chosenState.type.isArray ? '[]': ''}</p>
        ) : (
          <p>select a page state to update.</p>
        )
      }

      <Handle type='target' id='a-next' position={Position.Left} style={{ top: 30, bottom: 'auto' }} />
      <Handle type='source' id='b-next' position={Position.Right} style={{ top: 30, bottom: 'auto' }} />

      {
        chosenState && <Handle type='target' id={`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`} position={Position.Left} style={{ top: 122, bottom: 'auto' }} />
      }
    </Card>
  )
}
 
export default memo(SetPageDataNode)