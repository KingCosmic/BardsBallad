import { memo } from 'react'

import {
  Handle,
  type NodeProps,
  type Node,
  Position
} from '@xyflow/react'

import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react'
import { Param } from '../utils';
 
function EntryNode({ id, data: { params } }: NodeProps<Node<{ params: Param[] }>>) {
  
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Entry</IonCardTitle>
      </IonCardHeader>
      <Handle type='source' id='start-node' position={Position.Right}
        style={{ top: 30, bottom: 'auto' }}
      />

      <IonCardContent>
        {
          params.map(p => (
            <p key={p.name} style={{ textAlign: 'right', marginTop: 5 }}>
              ({p.type}{p.isArray ? '[]' : ''}) {p.name}
            </p>
          ))
        }
      </IonCardContent>
      {
        params.map((p, i) => (
          <Handle key={p.name} type='source' id={`${p.name}-${p.type}`} position={Position.Right}
            style={{ top: 85 + (25 * i), bottom: 'auto' }}
          />
        ))
      }
    </IonCard>
  )
}
 
export default memo(EntryNode);