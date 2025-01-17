import { memo, useCallback, useEffect } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
  useUpdateNodeInternals
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonText } from '@ionic/react'
import { systemState } from '../../../state/system'
import getTypeFromProperty from '../../../utils/getTypeOfProperty'
 
function SetCharacterDataNode({ id, data: { path, type } }: NodeProps<Node<{ path: string; type: string; }>>) {
  const { updateNodeData } = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()
  
  const system = systemState.useValue()

  const updateTypeFromPath = useCallback((ev: Event) => {
    const path = (ev.target as HTMLIonInputElement).value as string

    const type = getTypeFromProperty(system?.defaultCharacterData || {}, path)

    updateNodeData(id, { path, type })
    updateNodeInternals(id)
  }, [id, updateNodeData, updateNodeInternals])

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Set Character Data</IonCardTitle>
      </IonCardHeader>
      <Handle type='target' id='from-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <IonInput label='path' labelPlacement='floating' fill='outline' placeholder='path/to/data/from/system' value={path} onIonChange={updateTypeFromPath} />

        <IonText>
          <p>Calculated type {type}</p>
        </IonText>
      </IonCardContent>
      {
        (type !== 'unknown') ? (
          <Handle type='target' id={`input-${type}`} position={Position.Left} style={{ bottom: 20, top: 'auto'}} />
        ) : null
      }
    </IonCard>
  )
}
 
export default memo(SetCharacterDataNode)