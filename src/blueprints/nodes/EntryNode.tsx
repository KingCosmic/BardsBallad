import { memo, useEffect } from 'react'

import Card from '@components/Card'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { Param } from '@blueprints/utils'

import { editorState } from '@state/editor'
import { SystemData, type SystemType } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'

const EntryNode: React.FC<NodeProps<Node<{ params: Param[], inputs: { [key:string]: any }, outputs: { [key:string]: SystemType | null } }>>> = ({ id, data: { params } }) => {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()

  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  useEffect(() => {
    let outputs: { [key:string]: SystemType | null } = {}

    for (let p = 0; p < params.length; p++) {
      const param = params[p]

      outputs[`${param.name}-${param.type}`] = version?.data.types.find(t => t.name === param.type)!
    }

    updateNodeData(id, { outputs })
    updateNodeInternals(id)
  }, [params])

  return (
    <Card title='Entry'>
      <Handle type='source' id='start-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      {
        params.map(p => (
          <p key={p.name} style={{ textAlign: 'right', marginTop: 5 }}>
            ({p.type}{p.isArray ? '[]' : ''}) {p.name}
          </p>
        ))
      }

      {
        params.map((p, i) => (
          <Handle key={p.name} type='source' id={`${p.name}-${p.type}`} position={Position.Right}
            style={{ top: 85 + (25 * i), bottom: 'auto' }}
          />
        ))
      }
    </Card>
  )
}
 
export default memo(EntryNode)

