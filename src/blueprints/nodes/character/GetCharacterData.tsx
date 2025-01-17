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
import getTypeFromProperty from '../../../utils/getTypeOfProperty'
import { systemState } from '../../../state/system'
 
function GetCharacterDataNode({ id, data: { path, type },  }: NodeProps<Node<{ path: string; type: string; pathData: any; }>>) {
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
        <IonCardTitle>Get Character Data</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonInput label='path' labelPlacement='floating' fill='outline' placeholder='path/to/data/in/character' value={path} onIonChange={updateTypeFromPath} />

        <IonText>
          <p>Calculated type {type}</p>
        </IonText>
      </IonCardContent>
      <Handle type='target' id='from-node' position={Position.Left} style={{ top: 30, bottom: 'auto' }} />
      <Handle type='source' id='next-node' position={Position.Right} style={{ top: 30, bottom: 'auto' }} />
      {
        (type !== 'unknown') ? (
          <Handle type='source' id={`output-${type}`} position={Position.Right} style={{ bottom: 20, top: 'auto'}} />
        ) : null
      }
    </IonCard>
  )
}
 
export default memo(GetCharacterDataNode);