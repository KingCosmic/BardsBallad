import { memo, useEffect, useMemo } from 'react'

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

import { editorState } from '@state/editor'
import { SystemData, type SystemType, type TypeData } from '@storage/schemas/system'

import Select from '@components/inputs/Select'
import Card from '@components/Card'
import { useVersionEdits } from '@hooks/useVersionEdits'
 
function SetPageDataNode({ id, data: { chosenState } }: NodeProps<Node<{ chosenState: { name: string, type: TypeData } | null }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  const connections = useNodeConnections()
  const nodeIds = useMemo(() => connections.filter(c => c.source !== id).map(c => c.source), [connections])
  const nodes = useNodesData(nodeIds)

  const page = useMemo(() => {
    if (editor.tab === 'editor') {
      return version?.data.pages.find(p => p.name === editor.characterPage)
    } else if (editor.tab === 'creator') {
      return version?.data.creator.find(p => p.name === editor.creatorPage)
    }
  }, [version, editor])
  
  useEffect(() => {
    let outputs: { [key:string]: SystemType | null } = {}

    if (!chosenState) chosenState = page?.state[0] || null

    if (chosenState) outputs[`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`] = version?.data.types.find(t => t.name === chosenState!.type.type) || null

    updateNodeData(id, { chosenState, outputs })
    updateNodeInternals(id)
  }, [connections, nodes, version, page])

  return (
    <Card title='Get Page State'>
      <Select id={`set-state-${id}`} label='State to grab' value={chosenState?.name || ''} onChange={state => {
        const chosenState = page?.state.find(s => s.name === state)!
        updateNodeData(id, {
          chosenState,
          outputs: {
            [`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`]: version?.data.types.find(t => t.name === chosenState.type.type)
          }
        })
        updateNodeInternals(id)
      }}>
        {page?.state.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
      </Select>

      {
        chosenState ? (
          <p className='text-right'>{chosenState.type.type}{chosenState.type.isArray ? '[]': ''}</p>
        ) : (
          <p className='text-right'>select a page state to get.</p>
        )
      }

      <Handle type='target' id='from-node' position={Position.Left} style={{ top: 30, bottom: 'auto' }} />
      <Handle type='source' id='next-node' position={Position.Right} style={{ top: 30, bottom: 'auto' }} />

      {
        chosenState && <Handle type='source' id={`${chosenState.name}-${chosenState.type.type}${chosenState.type.isArray ? '(Array)': ''}`} position={Position.Right} style={{ top: 122, bottom: 'auto' }} />
      }
    </Card>
  )
}
 
export default memo(SetPageDataNode)
