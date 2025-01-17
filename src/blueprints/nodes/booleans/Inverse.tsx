import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position,
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react'
 
function BooleanBranch(_props: NodeProps<Node<{ boolean: boolean; }>>) {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Inverse Boolean</IonCardTitle>
      </IonCardHeader>

      <Handle type='target' id='prev-node' position={Position.Left}
        style={{ top: 30, bottom: 'auto' }}
      />
      <Handle type='source' id='next-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        <p style={{ marginTop: 5 }}>
          input (boolean)
        </p>
        <Handle type='target' id='input-boolean' position={Position.Left}
          style={{ top: 30, bottom: 'auto' }}
        />

        <p style={{ textAlign: 'right', marginTop: 5 }}>
          (boolean) output
        </p>
        <Handle type='source' id='output-boolean' position={Position.Right}
          style={{ top: 55, bottom: 'auto' }}
        />
      </IonCardContent>
    </IonCard>
  )
}
 
export default memo(BooleanBranch)