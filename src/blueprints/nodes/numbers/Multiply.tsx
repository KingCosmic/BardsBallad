import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react'
 
function Multiply(_props: NodeProps<Node<{ number1: number; number2: number; }>>) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Multiply</IonCardTitle>
      </IonCardHeader>
      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <p style={{ marginTop: 5 }}>
          number 1
        </p>

        <p style={{ marginTop: 5 }}>
          number 2
        </p>

        <p style={{ marginTop: 5 }}>
          output
        </p>
      </IonCardContent>

      <Handle type='target' id='number1-number' position={Position.Left}
        style={{ top: 85, bottom: 'auto' }}
      />
      
      <Handle type='target' id='number2-number' position={Position.Left}
        style={{ top: 110, bottom: 'auto' }}
      />
      
      <Handle type='source' id='output-number' position={Position.Right}
        style={{ top: 135, bottom: 'auto' }}
      />
    </IonCard>
  )
}
 
export default memo(Multiply)