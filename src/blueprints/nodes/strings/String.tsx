import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput } from '@ionic/react'
 
function String({ id, data: { value }}: NodeProps<Node<{ value: string }>>) {
  const { updateNodeData } = useReactFlow()
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>String</IonCardTitle>
      </IonCardHeader>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <IonInput type='text' fill='solid' placeholder='String Value Here' value={value} onIonChange={(ev) => updateNodeData(id, { value: (ev.target as HTMLIonInputElement).value })} />
      </IonCardContent>
      
      <Handle type='source' id='output-string' position={Position.Right}
        style={{ top: 100, bottom: 'auto' }}
      />
    </IonCard>
  )
}
 
export default memo(String)