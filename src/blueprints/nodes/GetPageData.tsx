import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonText } from '@ionic/react'
 
function GetPageDataNode({ id, data }: NodeProps<Node<{ path: string }>>) {
  const { updateNodeData } = useReactFlow()
  
  const type = 'unknown'

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Get Page Data</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonInput label='path' labelPlacement='floating' fill='outline' placeholder='path/to/data/from/page' value={data.path} onIonChange={(ev: Event) => {
          const val = (ev.target as HTMLIonInputElement).value as string

          updateNodeData(id, { path: val })
        }} />

        <IonText>
          <p>Calculated type {type}</p>
        </IonText>
      </IonCardContent>
      <Handle type='target' position={Position.Left} />
      <Handle type='source' position={Position.Right} />
    </IonCard>
  )
}
 
export default memo(GetPageDataNode);