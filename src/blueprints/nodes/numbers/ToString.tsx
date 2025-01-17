import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react'
 
function ToString(_props: NodeProps<Node<{ number: number; }>>) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Number To String</IonCardTitle>
      </IonCardHeader>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <p style={{ marginTop: 5 }}>
          number
        </p>

        <p style={{ marginTop: 5, textAlign: 'right' }}>
          string
        </p>
      </IonCardContent>

      <Handle type='target' id='input-number' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='source' id='output-string' position={Position.Right}
        style={{ top: 110, bottom: 'auto' }}
      />
    </IonCard>
  )
}
 
export default memo(ToString)