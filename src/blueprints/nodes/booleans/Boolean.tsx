import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
  useReactFlow,
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCheckbox, IonInput } from '@ionic/react'
 
function String({ id, data: { value }}: NodeProps<Node<{ value: boolean }>>) {
  const { updateNodeData } = useReactFlow()
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Boolean</IonCardTitle>
      </IonCardHeader>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <IonCheckbox checked={value} onIonChange={() => updateNodeData(id, { value: !value })}>Value</IonCheckbox>
      </IonCardContent>
      
      <Handle type='source' id='output-boolean' position={Position.Right}
        style={{ top: 100, bottom: 'auto' }}
      />
    </IonCard>
  )
}
 
export default memo(String)