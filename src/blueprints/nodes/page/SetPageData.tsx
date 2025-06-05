import { memo, useEffect, useMemo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { editorState } from '@state/editor'
import { SystemData, type TypeData } from '@storage/schemas/system'

import Select from '@components/inputs/Select'
import Card from '@components/Card'
import { useVersionEdits } from '@hooks/useVersionEdits'
 
function GetPageDataNode({ id, data: { chosenState } }: NodeProps<Node<{ chosenState: { name: string, type: TypeData } | null }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  const page = useMemo(() => {
    if (editor.tab === 'editor') {
      return version?.data.pages.find(p => p.name === editor.characterPage)
    } else if (editor.tab === 'creator') {
      return version?.data.creator.find(p => p.name === editor.creatorPage)
    }
  }, [version, editor])

  useEffect(() => {
    if (!chosenState) chosenState = page?.state[0] || null

    updateNodeData(id, { chosenState })
  }, [page, chosenState])

  return (
    <Card title='Set Page State'>
      <Select id={`set-state-${id}`} label='State to change' value={chosenState?.name || ''} onChange={state => {
        updateNodeData(id, { chosenState: page?.state.find(s => s.name === state) })
        updateNodeInternals(id)
      }}>
        {page?.state.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
      </Select>

      {
        chosenState ? (
          <p>{chosenState.type.type}{chosenState.type.isArray ? '[]': ''}</p>
        ) : (
          <p>select a page state to set.</p>
        )
      }

      <Handle type='target' id='from-node' position={Position.Left} style={{ top: 30, bottom: 'auto' }} />
      <Handle type='source' id='next-node' position={Position.Right} style={{ top: 30, bottom: 'auto' }} />

      {
        chosenState && <Handle type='target' id={`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`} position={Position.Left} style={{ top: 122, bottom: 'auto' }} />
      }
    </Card>
  )
}
 
export default memo(GetPageDataNode)
